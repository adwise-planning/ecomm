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
TEAM_DATA_FILE = "team_data.json"

def read_team_data():
    try:
        with open(TEAM_DATA_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_team_data(data):
    with open(TEAM_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

INTEGRATIONS_DATA_FILE = "integrations_data.json"

def read_integrations_data():
    try:
        with open(INTEGRATIONS_DATA_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_integrations_data(data):
    with open(INTEGRATIONS_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

SUBSCRIPTION_DATA_FILE = "subscription_data.json"

def read_subscription_data():
    try:
        with open(SUBSCRIPTION_DATA_FILE, 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def write_subscription_data(data):
    with open(SUBSCRIPTION_DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

INVOICES = [
    {"id": "inv_001", "date": "2025-12-01", "amount": 199.99, "status": "paid"},
    {"id": "inv_002", "date": "2025-12-15", "amount": 49.99, "status": "pending"},
    {"id": "inv_003", "date": "2025-11-20", "amount": 150.00, "status": "paid"},
]

SETTINGS = {"notifications": True, "currency": "INR", "timezone": "Asia/Kolkata"}

# --- Route Handlers & Data Generators ---

USERS = {
    "l1.admin@example.com": {"id": 1, "name": "Aarav Sharma (L1)", "email": "l1.admin@example.com", "role": "L1", "company": "SuperAdmin Co", "password": "password"},
    "l2.manager@example.com": {"id": 2, "name": "Rohan Mehta (L2)", "email": "l2.manager@example.com", "role": "L2", "company": "Analytics Inc.", "password": "password"},
    "l3.client@example.com": {"id": 3, "name": "Diya Patel (L3)", "email": "l3.client@example.com", "role": "L3", "company": "Logistics LLC", "password": "password"},
    "l4.viewer@example.com": {"id": 4, "name": "Priya Singh (L4)", "email": "l4.viewer@example.com", "role": "L4", "company": "Logistics LLC", "password": "password"},
}

def handle_auth_login(body):
    email = body.get("email")
    password = body.get("password")

    if isinstance(email, list): email = email[0]
    if isinstance(password, list): password = password[0]

    if not email or not password:
        return 400, {"message": "Email and password are required"}

    user = USERS.get(email)
    if user and user["password"] == password:
        # Don't send password back to client
        user_data = {k: v for k, v in user.items() if k != 'password'}
        user_data["token"] = f"token-for-{user['role']}"
        logger.info("Login success: %s as %s", email, user['role'])
        return 200, {"user": user_data}

    logger.warning("Login failed for %s", email)
    return 401, {"message": "Invalid credentials"}


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


RECOMMENDATION_POOL = [
    {"id": "rec_1", "title": "Enable partial COD for high-value orders", "impact": "high", "category": "Payment", "description": "Reduce RTO risk by collecting a partial payment upfront for Cash on Delivery orders above a certain value.", "action_link": "/settings/payments"},
    {"id": "rec_2", "title": "Re-target users with abandoned carts via WhatsApp", "impact": "medium", "category": "Marketing", "description": "Engage customers who have dropped off during checkout using automated WhatsApp messages to recover potentially lost sales.", "action_link": "/integrations/whatsapp"},
    {"id": "rec_3", "title": "Analyze shipping zones with high RTO rates", "impact": "high", "category": "Logistics", "description": "Identify pincodes or regions with unusually high Return to Origin rates to optimize your shipping strategy.", "action_link": "/analytics/rto"},
    {"id": "rec_4", "title": "Introduce express shipping options", "impact": "medium", "category": "Logistics", "description": "Offer faster shipping options at a premium to improve customer satisfaction and potentially increase conversion rates.", "action_link": "/settings/shipping"},
    {"id": "rec_5", "title": "Run a flash sale on slow-moving inventory", "impact": "low", "category": "Marketing", "description": "Clear out old stock and generate quick revenue by offering a limited-time discount on products with low sales velocity.", "action_link": "/products/inventory"},
    {"id": "rec_6", "title": "Optimize product images for faster load times", "impact": "low", "category": "Website", "description": "Improve user experience and SEO by compressing and resizing product images, leading to faster page loads.", "action_link": "/settings/theme"},
    {"id": "rec_7", "title": "A/B test your checkout button color", "impact": "medium", "category": "Website", "description": "Experiment with different colors for your 'Buy Now' or 'Checkout' button to see if it impacts conversion rates.", "action_link": "/settings/theme"},
]

def generate_recommendations():
    # Simulate some AI variability - sometimes it might not have any recommendations
    if random.random() < 0.1: # 10% chance of no recommendations
        return {"recommendations": []}

    # Select a random number of recommendations
    num_to_return = random.randint(2, 4)
    return {
        "recommendations": random.sample(RECOMMENDATION_POOL, num_to_return)
    }

def generate_rto_analytics():
    regions = ["North", "South", "East", "West"]
    risks = ["Critical", "High", "Moderate", "Low"]
    reasons = ["Customer Not Available", "Incorrect Address", "Order Cancelled by Customer", "Other"]

    return {
        "byRegion": [
            {"name": region, "value": round(random.uniform(5, 25), 1), "risk": random.choice(risks)}
            for region in regions
        ],
        "reasons": [
            {"name": reason, "value": random.randint(100, 500)}
            for reason in reasons
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
        elif path == "/analytics/rto" and method == "GET":
            payload = generate_rto_analytics()
            status = 200
        elif path == "/ai/recommendations" and method == "GET":
            payload = generate_recommendations()
            status = 200
        elif path == "/integrations" and method == "GET":
            payload = {"integrations": read_integrations_data()}
            status = 200
        elif path.startswith("/integrations/") and method == "PUT":
            integration_id = path.split('/')[-1]
            integrations = read_integrations_data()
            integration = next((i for i in integrations if i['id'] == integration_id), None)
            if integration:
                integration['connected'] = body.get('connected', integration['connected'])
                write_integrations_data(integrations)
                status, payload = 200, {"integration": integration}
            else:
                status, payload = 404, {"message": "Integration not found"}
        elif path == "/team" and method == "GET":
            payload = {"members": read_team_data()}
            status = 200
        elif path == "/team/invite" and method == "POST":
            email = body.get("email")
            role = body.get("role")
            if not email or not role:
                status, payload = 400, {"message": "Email and role are required"}
            else:
                team = read_team_data()
                new_id = max(m['id'] for m in team) + 1 if team else 1
                new_member = {"id": new_id, "name": body.get("name") or email.split("@")[0], "email": email, "role": role}
                team.append(new_member)
                write_team_data(team)
                status, payload = 201, {"message": "Invitation sent", "member": new_member}
        elif path.startswith("/team/") and method in ["PUT", "DELETE"]:
            try:
                member_id = int(path.split('/')[-1])
            except ValueError:
                status, payload = 400, {"message": "Invalid member ID"}
            else:
                team = read_team_data()
                member_index, member = next(((i, m) for i, m in enumerate(team) if m['id'] == member_id), (None, None))

                if member is None:
                    status, payload = 404, {"message": "Team member not found"}
                elif method == "PUT":
                    new_role = body.get("role")
                    if new_role not in ["L1", "L2", "L3", "L4", "invited"]:
                        status, payload = 400, {"message": "Invalid role"}
                    else:
                        member['role'] = new_role
                        write_team_data(team)
                        status, payload = 200, {"member": member}
                elif method == "DELETE":
                    team.pop(member_index)
                    write_team_data(team)
                    status, payload = 200, {"message": "Member removed"}
        elif path == "/billing/subscription" and method == "GET":
            # Hardcoded user_id for simplicity
            user_id = "user_id_1"
            subscriptions = read_subscription_data()
            payload = {"subscription": subscriptions.get(user_id)}
            status = 200
        elif path == "/billing/subscription" and method == "PUT":
            user_id = "user_id_1"
            subscriptions = read_subscription_data()
            if user_id not in subscriptions: subscriptions[user_id] = {}

            new_plan = body.get("plan")
            # In a real app, you'd have plan details stored somewhere
            plan_details = {
                "Basic": {"price": 49.00}, "Pro": {"price": 99.00}, "Enterprise": {"price": 249.00}
            }
            if new_plan in plan_details:
                subscriptions[user_id]["plan"] = new_plan
                subscriptions[user_id]["price"] = plan_details[new_plan]["price"]
                subscriptions[user_id]["next_invoice"] = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
                write_subscription_data(subscriptions)
                status, payload = 200, {"subscription": subscriptions[user_id]}
            else:
                status, payload = 400, {"message": "Invalid plan"}
        elif path == "/user/profile" and method == "PUT":
            # This is a mock endpoint, in a real app it would update a database
            updated_user_data = body
            logger.info("User profile updated with: %s", updated_user_data)
            # Just echo back the data sent, assuming the update was successful
            status, payload = 200, {"user": updated_user_data}
        elif path == "/support/request" and method == "POST":
            subject = body.get('subject')
            message = body.get('message')
            logger.info(f"New support request received: Subject='{subject}'")
            # No data persistence, just acknowledge receipt
            status, payload = 200, {"message": "Support request received. We will get back to you shortly."}
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
