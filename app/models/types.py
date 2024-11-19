from typing import TypedDict, List

class ShareDict(TypedDict):
    id: int
    user_id: int
    stock_id: int
    quantity: int
    average_price: float
    created_at: str
    updated_at: str

class UserDict(TypedDict):
    id: int
    first_name: str
    last_name: str
    username: str
    email: str
    buying_power: float
    total_net_worth: float
    bank_debt: float
    shares: List[ShareDict]
    created_at: str
    updated_at: str