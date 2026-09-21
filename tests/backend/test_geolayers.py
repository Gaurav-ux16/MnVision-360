import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_geo_layers():
    response = client.get("/api/geo-layers")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "layers" in data
    assert data["total"] >= 10
    
    # Check layer properties
    first_layer = data["layers"][0]
    assert "id" in first_layer
    assert "name" in first_layer
    assert "category" in first_layer
    assert "type" in first_layer
    assert "crs" in first_layer
    assert "bounds" in first_layer

def test_get_geo_layer_details():
    response = client.get("/api/geo-layers/gsi-geology")
    assert response.status_code == 200
    layer = response.json()
    assert layer["id"] == "gsi-geology"
    assert layer["category"] == "GEOLOGY"
    assert layer["crs"] == "EPSG:4326"

def test_list_study_areas():
    response = client.get("/api/study-areas")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "study_areas" in data
    assert data["total"] >= 4
    
    balaghat = data["study_areas"][0]
    assert balaghat["id"] == "balaghat-main"
    assert balaghat["region"] == "Madhya Pradesh"
