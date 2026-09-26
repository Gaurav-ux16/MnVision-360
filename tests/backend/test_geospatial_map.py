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

def test_india_boundaries_geojson():
    response = client.get("/api/geospatial/boundaries/india")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) >= 5
    # Verify India boundary present
    ind_feat = next((f for f in data["features"] if f["properties"].get("code") == "IND"), None)
    assert ind_feat is not None
    assert ind_feat["geometry"]["type"] == "Polygon"

def test_targets_geojson():
    response = client.get("/api/geospatial/targets/geojson")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) >= 5
    # Check Target T001
    t1 = next((f for f in data["features"] if f["properties"].get("target_id") == "T001"), None)
    assert t1 is not None
    assert t1["geometry"]["type"] == "Point"
    assert t1["properties"]["prospectivity_score"] == 0.92

def test_occurrences_geojson():
    response = client.get("/api/geospatial/occurrences/geojson")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) >= 4

def test_prospectivity_grid():
    response = client.get("/api/geospatial/prospectivity/grid")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 50

def test_spatial_point_query_balaghat():
    response = client.get("/api/geospatial/query?lat=21.84&lon=80.72")
    assert response.status_code == 200
    res = response.json()
    assert res["location"]["state"] == "Madhya Pradesh"
    assert res["prospectivity"]["score"] > 80.0
    assert res["geochemistry"]["mn_ppm"] > 25000
    assert res["nearest_target"] is not None
    assert res["nearest_target"]["target_id"] == "T001"

def test_spatial_point_query_sandur():
    response = client.get("/api/geospatial/query?lat=15.08&lon=76.55")
    assert response.status_code == 200
    res = response.json()
    assert res["location"]["state"] == "Karnataka"
    assert res["prospectivity"]["score"] > 60.0

def test_spatial_point_query_off_data():
    response = client.get("/api/geospatial/query?lat=0.0&lon=0.0")
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "NO_DATA"

def test_prospectivity_raster_tile():
    response = client.get("/api/geospatial/tiles/prospectivity/5/23/14.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 1000 # Valid PNG tile
