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
from datetime import datetime, timedelta
import random

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


# --- Demo data stores (in-memory) ---
TEAM = [
    {"id": 1, "name": "Aarav Sharma", "email": "aarav.sharma@example.com", "role": "L1"},
    {"id": 2, "name": "Diya Patel", "email": "diya.patel@example.com", "role": "L3"},
    {"id": 3, "name": "Rohan Mehta", "email": "rohan.mehta@example.com", "role": "L2"},
    {"id": 4, "name": "Priya Singh", "email": "priya.singh@example.com", "role": "L4"},
]

INTEGRATIONS = [
    {"id": "stripe", "name": "Stripe", "connected": True},
    {"id": "klarna", "name": "Klarna", "connected": False},
    {"id": "razorpay", "name": "Razorpay", "connected": True},
    {"id": "shiprocket", "name": "Shiprocket", "connected": False},
]

INVOICES = [
    {"id": "inv_001", "date": "2025-12-01", "amount": 199.99, "status": "paid"},
    {"id": "inv_002", "date": "2025-12-15", "amount": 49.99, "status": "pending"},
    {"id": "inv_003", "date": "2025-11-20", "amount": 150.00, "status": "paid"},
]

SETTINGS = {"notifications": True, "currency": "INR", "timezone": "Asia/Kolkata"}

# --- Route Handlers & Data Generators ---

USER_ROLES = {
    "1111": {"id": 1, "name": "Aarav Sharma (L1)", "email": "l1@example.com", "role": "L1", "company": "SuperAdmin Co"},
    "2222": {"id": 2, "name": "Rohan Mehta (L2)", "email": "l2@example.com", "role": "L2", "company": "Analytics Inc."},
    "3333": {"id": 3, "name": "Diya Patel (L3)", "email": "l3@example.com", "role": "L3", "company": "Logistics LLC"},
    "4444": {"id": 4, "name": "Priya Singh (L4)", "email": "l4@example.com", "role": "L4", "company": "Support Solutions"},
}

def handle_auth_login(body):
    email = body.get("email")
    otp = body.get("otp")
    if isinstance(email, list): email = email[0]
    if isinstance(otp, list): otp = otp[0]

    if not email or not otp:
        return 400, {"message": "Email and OTP are required"}

    if otp in USER_ROLES:
        user = USER_ROLES[otp]
        user["token"] = f"token-for-{user['role']}"
        logger.info("Login success: %s as %s", email, user['role'])
        return 200, {"user": user}

    logger.warning("Login failed for %s with otp=%s", email, otp)
    return 401, {"message": "Invalid OTP"}


def generate_dashboard_metrics(range_str):
    days = int(range_str.replace('d', ''))

    # Base values
    base_revenue = 10000 * days
    base_orders = 20 * days
    base_rto_rate = 5.0
    base_roi = 500 * days

    # Simulate some variance
    revenue_val = base_revenue * (1 + random.uniform(-0.1, 0.1))
    orders_val = int(base_orders * (1 + random.uniform(-0.1, 0.1)))
    rto_rate_val = base_rto_rate + random.uniform(-1.0, 1.0)
    roi_val = base_roi * (1 + random.uniform(-0.2, 0.2))

    # Generate chart data
    chart_data = []
    end_date = datetime.now()
    for i in range(days):
        date = end_date - timedelta(days=i)
        chart_data.append({
            "name": date.strftime('%b %d'),
            "revenue": 1000 + i * 50 + random.randint(-200, 200),
            "rtoRate": 5 + random.uniform(-2, 2)
        })
    chart_data.reverse()

    return {
        "revenue": {"value": revenue_val, "growth": round(random.uniform(-5, 15), 1)},
        "orders": {"value": orders_val, "growth": round(random.uniform(-5, 15), 1)},
        "rtoRate": {"value": round(rto_rate_val, 1), "growth": round(random.uniform(-1, 1), 1)},
        "roi": {"value": roi_val, "growth": round(random.uniform(-5, 20), 1)},
        "chartData": chart_data
    }


def generate_orders(page=1, limit=10, sortBy=None, sortDir="asc", status=None, paymentMode=None, searchTerm=""):
    total = 150
    orders = []
    statuses = ["Delivered", "Shipped", "Processing", "Returned", "Cancelled"]
    payment_modes = ["Prepaid", "COD"]

    for i in range(1, total + 1):
        orders.append({
            "id": f"ORD-{1000 + i}",
            "date": (datetime.now() - timedelta(days=i % 60)).strftime('%Y-%m-%d'),
            "amount": round(50 + (i * 17.33) % 800, 2),
            "status": statuses[i % len(statuses)],
            "paymentMode": payment_modes[i % len(payment_modes)],
            "customer": f"Customer {i}"
        })

    # Filtering
    if status: orders = [o for o in orders if o['status'].lower() == status.lower()]
    if paymentMode: orders = [o for o in orders if o['paymentMode'].lower() == paymentMode.lower()]
    if searchTerm: orders = [o for o in orders if searchTerm.lower() in o['id'].lower() or searchTerm.lower() in o['customer'].lower()]

    # Sorting
    if sortBy:
        reverse = sortDir.lower() == "desc"
        orders.sort(key=lambda o: o.get(sortBy) or 0, reverse=reverse)

    # Pagination
    filtered_total = len(orders)
    start = (page - 1) * limit
    end = start + limit

    logger.debug(f"generate_orders: page={page} limit={limit} sortBy={sortBy} sortDir={sortDir} returned={len(orders[start:end])}")
    return {"data": orders[start:end], "page": page, "limit": limit, "total": filtered_total}


def generate_recommendations():
    return {
        "recommendations": [
            {"id": "rec_1", "title": "Enable partial COD for high-value orders", "impact": "high"},
            {"id": "rec_2", "title": "Re-target users with abandoned carts via WhatsApp", "impact": "medium"},
            {"id": "rec_3", "title": "Analyze shipping zones with high RTO rates", "impact": "high"},
        ]
    }

# --- Main Application ---

def application(environ, start_response):
    method = environ.get("REQUEST_METHOD")
    path = environ.get("PATH_INFO", "")
    qs = parse_qs(environ.get("QUERY_STRING", ""))
    body = parse_body(environ)

    if method == "OPTIONS":
        start_response("204 No Content", [("Access-Control-Allow-Origin", "*"), ("Access-Control-Allow-Methods", "GET,POST,PUT,OPTIONS"), ("Access-Control-Allow-Headers", "Content-Type, Authorization")])
        return [b""]

    try:
        logger.info(f"request: {method} {path} qs={qs} body={body if body else '{}'}")

        if path == "/auth/login" and method == "POST":
            status, payload = handle_auth_login(body)
        elif path == "/dashboard/metrics" and method == "GET":
            range_days = qs.get("range", ["30d"])[0]
            payload = generate_dashboard_metrics(range_days)
            status = 200
        elif path == "/orders" and method == "GET":
            page = int(qs.get("page", ["1"])[0])
            limit = int(qs.get("limit", ["10"])[0])
            sortBy = qs.get("sortBy", [None])[0]
            sortDir = qs.get("sortDir", ["asc"])[0]
            status_filter = qs.get("status", [None])[0]
            payment_filter = qs.get("paymentMode", [None])[0]
            search = qs.get("searchTerm", [""])[0]
            payload = generate_orders(page=page, limit=limit, sortBy=sortBy, sortDir=sortDir, status=status_filter, paymentMode=payment_filter, searchTerm=search)
            status = 200
        elif path == "/ai/recommendations" and method == "GET":
            payload = generate_recommendations()
            status = 200
        elif path == "/integrations" and method == "GET":
            payload = {"integrations": INTEGRATIONS}
            status = 200
        elif path == "/team" and method == "GET":
            payload = {"members": TEAM}
            status = 200
        elif path == "/team/invite" and method == "POST":
            email = body.get("email")
            if not email:
                status, payload = 400, {"message": "Email is required"}
            else:
                new_member = {"id": len(TEAM) + 1, "name": body.get("name") or email.split("@")[0], "email": email, "role": "invited"}
                TEAM.append(new_member)
                status, payload = 201, {"message": "Invitation sent", "member": new_member}
        elif path == "/billing/invoices" and method == "GET":
            payload = {"invoices": INVOICES}
            status = 200
        elif path == "/settings" and method == "PUT":
            SETTINGS.update(body or {})
            status, payload = 200, {"settings": SETTINGS}
        else:
            status, payload = 404, {"message": "Not Found", "path": path}

        logger.debug(f"response: {method} {path} -> {status}")
        return json_response(start_response, status, payload)

    except Exception as e:
        logger.exception("Unhandled error processing request %s %s", method, path)
        return json_response(start_response, 500, {"message": "Internal server error"})


if __name__ == "__main__":
    print(f"Mock API server running on http://0.0.0.0:{PORT}")
    server = make_server("0.0.0.0", PORT, application)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
