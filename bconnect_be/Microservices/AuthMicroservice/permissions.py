roles = [
    "buyer",
    "seller",
    "support",
    "admin"
]

permissions = {
    "buyer" : [
        "request_make_seller",
        "get_seller_requests",
        "agree_seller_terms"
    ],
    "seller": [
        "create_product",
        "agree_seller_terms"
    ],
    "support": [
        "get_identification",
        "get_seller_requests"
    ],
    "admin": [
        "create_product",
        "get_identification",
        "get_seller_requests"
    ]
}