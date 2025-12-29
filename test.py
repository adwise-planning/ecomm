#!/usr/bin/env python3
"""
Lightweight mock API server for local testing of the frontend.

Usage:
  python test.py

This file implements all endpoints used by the app and returns demo/test data
with permutations based on query params or request bodies. It uses only the
Python stdlib (wsgiref) so no extra packages are required.
"""
from wsgiref.simple_server import make_server
from urllib.parse import parse_qs
import json
import time
import logging
from datetime import datetime

PORT = 5000


def json_response(start_response, status_code, data):
    body = json.dumps(data).encode("utf-8")
    headers = [
        ("Content-Type", "application/json; charset=utf-8"),
        ("Content-Length", str(len(body))),
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS"),
        ("Access-Control-Allow-Headers", "Content-Type, Authorization"),
    ]
    start_response(f"{status_code} OK", headers)
    return [body]


def setup_logging():
    logger = logging.getLogger("mock_api")
    logger.setLevel(logging.DEBUG)
    fmt = logging.Formatter("%(asctime)s %(levelname)s %(message)s")

    # console handler
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(fmt)
    logger.addHandler(ch)

    # file handler
    fh = logging.FileHandler("test_server.log")
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(fmt)
    logger.addHandler(fh)

    return logger


logger = setup_logging()


def parse_body(environ):
    try:
        size = int(environ.get("CONTENT_LENGTH") or 0)
    except (ValueError, TypeError):
        size = 0
    if size:
        body = environ["wsgi.input"].read(size).decode("utf-8")
        try:
            return json.loads(body)
        except Exception:
            logger.debug("parse_body: received non-json body")
            return parse_qs(body)
    return {}


# Demo data stores (in-memory)
TEAM = [
    {"id": 1, "name": "Alice Admin", "email": "alice@example.com", "role": "admin"},
    {"id": 2, "name": "Bob Ops", "email": "bob@example.com", "role": "member"},
]

INTEGRATIONS = [
    {"id": "stripe", "name": "Stripe", "connected": True},
    {"id": "klarna", "name": "Klarna", "connected": False},
]

INVOICES = [
    {"id": "inv_001", "date": "2025-12-01", "amount": 199.99, "status": "paid"},
    {"id": "inv_002", "date": "2025-12-15", "amount": 49.99, "status": "pending"},
]

SETTINGS = {"notifications": True, "currency": "INR", "timezone": "Asia/Kolkata"}


def handle_auth_login(body):
    email = body.get("email")
    otp = body.get("otp")
    # Support both JSON and form-encoded (parse_qs) bodies
    if isinstance(email, list):
        email = email[0]
    if isinstance(otp, list):
        otp = otp[0]

    # Demo permutations
    if not email or not otp:
        return 400, {"message": "email and otp required"}

    # Good credential
    if otp == "1234":
        user = {"id": 100, "name": "Demo User", "email": email, "token": "demo-token-abc", "role": "member"}
        logger.info("login success: %s (member)", email)
        return 200, {"user": user}

    # OTP 'admin' returns admin user
    if otp == "admin":
        user = {"id": 1, "name": "Demo Admin", "email": email, "token": "admin-token-xyz", "role": "admin"}
        logger.info("login success: %s (admin)", email)
        return 200, {"user": user}

    logger.warning("login failed for %s with otp=%s", email, otp)
    return 401, {"message": "Invalid OTP"}


def generate_dashboard_metrics(range_days):
    if range_days == "7":
        revenue = {"value": 12345.67, "growth": 2.3}
        orders = {"value": 321, "growth": 1.1}
        rtoRate = {"value": 4.2, "growth": -0.5}
    elif range_days == "30":
        revenue = {"value": 54321.12, "growth": 5.8}
        orders = {"value": 1290, "growth": 3.8}
        rtoRate = {"value": 6.5, "growth": 0.2}
    else:
        revenue = {"value": 200000.0, "growth": 12.0}
        orders = {"value": 5200, "growth": 10.0}
        rtoRate = {"value": 7.1, "growth": 1.5}

    return {"revenue": revenue, "orders": orders, "rtoRate": rtoRate}


def generate_orders(page=1, limit=10, sortBy=None, sortDir="asc"):
    total = 45
    orders = []
    statuses = ["delivered", "shipped", "processing", "returned"]
    for i in range(1, total + 1):
        orders.append(
            {
                "id": f"ORD-{1000 + i}",
                "date": f"2025-12-{(i%28)+1:02d}",
                "amount": round(50 + (i * 7.33) % 500, 2),
                "status": statuses[i % len(statuses)],
            }
        )

    # simple sort
    if sortBy:
        reverse = sortDir == "desc"
        orders.sort(key=lambda o: o.get(sortBy) or 0, reverse=reverse)

    # pagination
    start = (page - 1) * limit
    end = start + limit
    logger.debug("generate_orders: page=%s limit=%s sortBy=%s sortDir=%s returned=%s", page, limit, sortBy, sortDir, len(orders[start:end]))
    return {"data": orders[start:end], "page": page, "limit": limit, "total": total}


def generate_rto_timeseries():
    points = []
    now = int(time.time())
    for i in range(12):
        points.append({"ts": now - (11 - i) * 86400, "rto": round(5 + (i * 0.3), 2)})
    return {"series": points}


def generate_recommendations():
    return {
        "recommendations": [
            {"id": "rec_1", "title": "Offer free shipping over ₹999", "impact": "high"},
            {"id": "rec_2", "title": "Re-target users with abandoned carts", "impact": "medium"},
        ]
    }


def application(environ, start_response):
    method = environ.get("REQUEST_METHOD")
    path = environ.get("PATH_INFO", "")
    qs = parse_qs(environ.get("QUERY_STRING", ""))

    # OPTIONS preflight
    if method == "OPTIONS":
        start_response("204 No Content", [("Access-Control-Allow-Origin", "*"), ("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS"), ("Access-Control-Allow-Headers", "Content-Type, Authorization")])
        return [b""]

    body = parse_body(environ)

    # Routes
    try:
        logger.info("request: %s %s qs=%s body=%s", method, path, qs, (body if body else "{}"))

        if path == "/auth/login" and method == "POST":
            status, payload = handle_auth_login(body)
            logger.debug("response: %s %s -> %s", method, path, status)
            return json_response(start_response, status, payload)

        if path == "/dashboard/metrics" and method == "GET":
            range_days = qs.get("range", ["30"])[0]
            payload = generate_dashboard_metrics(range_days)
            logger.debug("response: %s %s range=%s", method, path, range_days)
            return json_response(start_response, 200, payload)

        if path == "/orders" and method == "GET":
            page = int(qs.get("page", ["1"])[0])
            limit = int(qs.get("limit", ["10"])[0])
            sortBy = qs.get("sortBy", [None])[0]
            sortDir = qs.get("sortDir", ["asc"])[0]
            payload = generate_orders(page=page, limit=limit, sortBy=sortBy, sortDir=sortDir)
            logger.debug("response: %s %s page=%s limit=%s", method, path, page, limit)
            return json_response(start_response, 200, payload)

        if path == "/analytics/rto" and method == "GET":
            payload = generate_rto_timeseries()
            logger.debug("response: %s %s series_points=%s", method, path, len(payload.get("series", [])))
            return json_response(start_response, 200, payload)

        if path == "/ai/recommendations" and method == "GET":
            payload = generate_recommendations()
            logger.debug("response: %s %s count=%s", method, path, len(payload.get("recommendations", [])))
            return json_response(start_response, 200, payload)

        if path == "/integrations" and method == "GET":
            logger.debug("response: %s %s integrations=%s", method, path, len(INTEGRATIONS))
            return json_response(start_response, 200, {"integrations": INTEGRATIONS})

        if path == "/team" and method == "GET":
            logger.debug("response: %s %s members=%s", method, path, len(TEAM))
            return json_response(start_response, 200, {"members": TEAM})

        if path == "/team/invite" and method == "POST":
            email = body.get("email") or (body.get("email") and body.get("email")[0])
            name = body.get("name") or (body.get("name") and body.get("name")[0])
            if not email:
                logger.warning("invite failed: missing email")
                return json_response(start_response, 400, {"message": "email required"})
            new_member = {"id": len(TEAM) + 1, "name": name or email.split("@")[0], "email": email, "role": "invited"}
            TEAM.append(new_member)
            logger.info("invited new member: %s", email)
            return json_response(start_response, 201, {"message": "invited", "member": new_member})

        if path == "/billing/invoices" and method == "GET":
            logger.debug("response: %s %s invoices=%s", method, path, len(INVOICES))
            return json_response(start_response, 200, {"invoices": INVOICES})

        if path == "/settings" and method == "PUT":
            SETTINGS.update(body or {})
            logger.info("settings updated: %s", SETTINGS)
            return json_response(start_response, 200, {"settings": SETTINGS})

        # default 404
        logger.warning("not found: %s %s", method, path)
        return json_response(start_response, 404, {"message": "Not found", "path": path})
    except Exception as e:
        logger.exception("Unhandled error processing request %s %s", method, path)
        return json_response(start_response, 500, {"message": "Internal server error"})


if __name__ == "__main__":
    print(f"Mock API server running on http://0.0.0.0:{PORT}")
    server = make_server("0.0.0.0", PORT, application)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Shutting down")
