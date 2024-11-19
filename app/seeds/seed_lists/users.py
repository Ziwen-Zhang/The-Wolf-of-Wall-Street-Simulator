users = [
    {
        "username": "demo",
        "email": "demo@d.com",
        "password": "password",
        "first_name": "Demo",
        "last_name": "User",
    },
]

for i in range(2, 101):
    users.append({
        "username": f"user_{i}",
        "email": f"user_{i}@example.com",
        "password": "password",
        "first_name": f"FirstName{i}",
        "last_name": f"LastName{i}",
    })

