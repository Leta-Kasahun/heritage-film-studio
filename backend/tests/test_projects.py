def test_health_endpoint(client):
    res = client.get("/api/health/")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


def test_project_crud_and_stats(client):
    create_res = client.post(
        "/api/projects/",
        json={
            "title": "Grandmother's Market Road",
            "heritage_topic": "Dessie Thursday market",
            "language_code": "am",
            "settings": {"aspect_ratios": ["16:9", "9:16"]},
        },
    )
    assert create_res.status_code == 201
    project = create_res.json()
    project_id = project["id"]
    assert project["status"] == "draft"

    stats_res = client.get("/api/stats/")
    assert stats_res.status_code == 200
    assert stats_res.json()["total_projects"] == 1

    upload_res = client.post(
        f"/api/projects/{project_id}/upload",
        files={"file": ("story.txt", b"My grandmother walked to market.", "text/plain")},
    )
    assert upload_res.status_code == 200
    assert upload_res.json()["status"] == "uploaded"

    del_res = client.delete(f"/api/projects/{project_id}")
    assert del_res.status_code == 204
