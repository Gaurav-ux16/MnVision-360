import pytest
from fastapi.testclient import TestClient
import sys
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.main import app

client = TestClient(app)


def test_subsurface_layers_catalog():
    """Verify catalog returns 20+ layers across the 6 required categories."""
    response = client.get("/api/geospatial/subsurface/layers")
    assert response.status_code == 200
    data = response.json()
    assert data["total_layers"] >= 20
    assert len(data["categories"]) == 6
    expected_categories = {"SURFACE", "TERRAIN", "GEOLOGY", "SOIL / REGOLITH", "MANGANESE EVIDENCE", "AI EXPLORATION"}
    assert set(data["categories"]) == expected_categories

    # Verify layer properties
    for layer in data["layers"]:
        assert "id" in layer
        assert "name" in layer
        assert "category" in layer
        assert "type" in layer
        assert "provenance_type" in layer
        assert layer["provenance_type"] in {"OBSERVED", "MODEL_DERIVED", "SYNTHETIC_PROTOTYPE"}


def test_subsurface_layers_category_filter():
    """Verify filtering catalog by category."""
    response = client.get("/api/geospatial/subsurface/layers?category=GEOLOGY")
    assert response.status_code == 200
    data = response.json()
    assert data["total_layers"] >= 4
    for l in data["layers"]:
        assert l["category"] == "GEOLOGY"


def test_subsurface_location_balaghat():
    """Verify reverse-geocoding for Balaghat coordinate."""
    response = client.get("/api/geospatial/subsurface/location?lat=21.84&lon=80.72")
    assert response.status_code == 200
    data = response.json()
    assert data["state"] == "Madhya Pradesh"
    assert data["district"] == "Balaghat District"
    assert "Sausar" in data["geological_basin"]
    assert data["in_known_craton"] is True
    assert data["nearest_target"] is not None
    assert data["nearest_target"]["target_id"] == "T001"
    assert data["confidence"]["score"] >= 0.80


def test_subsurface_location_sandur():
    """Verify reverse-geocoding for Sandur coordinate."""
    response = client.get("/api/geospatial/subsurface/location?lat=15.08&lon=76.55")
    assert response.status_code == 200
    data = response.json()
    assert data["state"] == "Karnataka"
    assert data["district"] == "Ballari District"
    assert "Sandur" in data["sector"]
    assert data["in_known_craton"] is True


def test_subsurface_location_out_of_bounds():
    """Verify handling of coordinates outside India."""
    response = client.get("/api/geospatial/subsurface/location?lat=0.0&lon=0.0")
    assert response.status_code == 200
    data = response.json()
    assert data["in_known_craton"] is False
    assert data["state"] == "Outside Geographic Boundary"


def test_subsurface_layer_stack_balaghat():
    """Verify 8-tier vertical evidence stack extraction at Balaghat."""
    response = client.get("/api/geospatial/subsurface/layer-stack?lat=21.84&lon=80.72")
    assert response.status_code == 200
    data = response.json()
    assert "stack_layers" in data
    assert len(data["stack_layers"]) == 8

    # Verify tiers order and schema
    tier_names = [t["tier_id"] for t in data["stack_layers"]]
    expected_tiers = [
        "tier-surface",
        "tier-vegetation",
        "tier-terrain",
        "tier-geology",
        "tier-soil",
        "tier-geochemistry",
        "tier-geophysics",
        "tier-prospectivity"
    ]
    assert tier_names == expected_tiers

    # Verify specific tier values for Balaghat
    geochem_tier = next(t for t in data["stack_layers"] if t["tier_id"] == "tier-geochemistry")
    assert geochem_tier["numeric_value"] > 20000  # High ppm Mn

    prospectivity_tier = next(t for t in data["stack_layers"] if t["tier_id"] == "tier-prospectivity")
    assert prospectivity_tier["numeric_value"] > 80.0  # High prospectivity %

    assert data["exploration_readiness"] == "DRILL_READY"
    assert "scientific_disclaimer" in data


def test_subsurface_drillholes_present():
    """Verify verified core drillhole returns when within proximity."""
    response = client.get("/api/geospatial/subsurface/drillholes?lat=21.84&lon=80.72&radius_km=5")
    assert response.status_code == 200
    data = response.json()
    assert data["has_drillhole"] is True
    assert data["count"] >= 1
    assert data["nearest_drillhole"]["drillhole_id"] == "DH-BAL-001"
    assert len(data["nearest_drillhole"]["intervals"]) >= 3
    # Check that high-grade Mn assay is present in intervals
    high_grade_interval = next(
        (iv for iv in data["nearest_drillhole"]["intervals"] if iv["mn_grade_pct"] > 30.0),
        None
    )
    assert high_grade_interval is not None
    assert high_grade_interval["mn_grade_pct"] == 34.5


def test_subsurface_drillholes_absent_scientific_honesty():
    """Verify no fake depths returned when drillhole is absent."""
    response = client.get("/api/geospatial/subsurface/drillholes?lat=20.0&lon=78.0&radius_km=5")
    assert response.status_code == 200
    data = response.json()
    assert data["has_drillhole"] is False
    assert data["count"] == 0
    assert "Surface and near-surface exploration evidence" in data["message"]
    assert data["status"] == "SURFACE_ONLY_EVIDENCE"


def test_subsurface_single_layer_value():
    """Verify single layer point query."""
    response = client.get("/api/geospatial/subsurface/layer-value?lat=21.84&lon=80.72&layer=srtm_dem")
    assert response.status_code == 200
    data = response.json()
    assert data["layer_id"] == "srtm_dem"
    assert "tier" in data
    assert data["tier"]["numeric_value"] > 0
