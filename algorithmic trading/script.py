import quandl
import datetime
aapl = quandl.get("WIKI/AAPL", start=datetime.datetime(2019, 10, 17), end=datetime.datetime(2019, 12, 17))
print(aapl)
