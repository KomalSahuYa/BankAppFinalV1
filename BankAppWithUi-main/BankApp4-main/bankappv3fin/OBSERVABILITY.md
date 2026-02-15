# Observability setup

## Endpoints
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Actuator health: `http://localhost:8080/actuator/health`
- Actuator info: `http://localhost:8080/actuator/info`
- Prometheus scrape endpoint: `http://localhost:8080/actuator/prometheus`

## Grafana
1. Configure Prometheus to scrape `http://localhost:8080/actuator/prometheus`.
2. Add Prometheus as a Grafana datasource.
3. Build dashboards using Spring/JVM metrics (e.g., `jvm_memory_used_bytes`, `http_server_requests_seconds_count`).
