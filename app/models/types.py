from typing import TypedDict, List

class ShareDict(TypedDict):
    user_id: int
    stock_id: int
    quantity: int
    average_price: float

class UserBasicDict(TypedDict):
    id: int
    first_name: str
    last_name: str
    username: str
    email: str

class UserFullDict(UserBasicDict):
    buying_power: float
    total_net_worth: float
    bank_debt: float
    shares: List[ShareDict]
