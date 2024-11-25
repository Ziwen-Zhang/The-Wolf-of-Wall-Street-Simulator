from decimal import Decimal
from functools import wraps


def format_date(format_type):
    def decorator(func):
        @wraps(func)
        def wrapper(self):
            date = func(self)
            if date is None:
                return ""

            if format_type == "short":
                return date.strftime("%m/%d/%Y")
            elif format_type == "my":
                return date.strftime("%m/%y")
            elif format_type == "long":
                return date.strftime("%b %d %Y")
            elif format_type == "long_suffix":
                day = int(date.strftime("%d"))
                suffix = (
                    "th"
                    if 11 <= day <= 13
                    else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
                )
                return date.strftime(f"%B {day}{suffix}, %Y")
            else:
                raise ValueError(f"Unknown format type: {format_type}")

        return wrapper

    return decorator

    ## mm/dd/yyyy
    ## mm/yy
    ## b/dd/yyyy

# def format_currency(value:float) -> str:
#     return "${:,.2f}".format(value)

def format_currency(value:float):
    return round(value, 2)
    # return float(Decimal(value).quantize(Decimal("0.00")))