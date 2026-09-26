import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_india_map_overview():
    response = client.get("/api/india-map/overview")
    assert response.status_code == 200
    data = response.json()
    assert "national_stats" in data
    assert "sites" in data
    assert data["national_stats"]["total_manganese_sites"] >= 6
    assert len(data["sites"]) >= 6

def test_list_india_manganese_sites():
    response = client.get("/api/india-map/sites")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "sites" in data
    assert data["total"] >= 6
    
    first_site = data["sites"][0]
    assert "site_code" in first_site
    assert "name" in first_site
    assert "state" in first_site
    assert "latitude" in first_site
    assert "longitude" in first_site
    assert "measured_mn_wt_pct" in first_site

def test_get_india_map_target_detail():
    response = client.get("/api/india-map/targets/T001")
    assert response.status_code == 200
    target = response.json()
    assert target["target_id"] == "T001"
    assert "manganese_status" in target
    assert target["manganese_status"]["measured_mn_wt_pct"] == 34.8
    assert target["manganese_status"]["estimated_mn_wt_pct"] == 31.2
    assert target["prospectivity_pct"] == 92.0
    assert target["confidence_pct"] == 86.0
    assert target["applicability"] == "HIGH"
    assert len(target["why_predicted_shap"]) >= 5
    assert len(target["evidence_cards"]) >= 5
