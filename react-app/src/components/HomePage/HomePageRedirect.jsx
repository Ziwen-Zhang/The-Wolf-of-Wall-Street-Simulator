import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function HomePageRedirect() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const isUserLoaded = useSelector((state) => state.session.isLoaded);
  const stocks = useSelector((state) => state.stock.stocks);
  const areStocksLoaded = useSelector((state) => state.stock.isLoaded);

  useEffect(() => {
    if (!isUserLoaded || !areStocksLoaded) {
      return;
    }
    if (user) {
      navigate('/user');
    }
     else if (stocks.length > 0) {
      const firstStockId = stocks[0].id;
      navigate(`/stocks/${firstStockId}`);
    }
  }, [user, isUserLoaded, stocks, areStocksLoaded, navigate]);

  return <div className="text-gray-500 text-center mt-4">Loading...</div>;
}

export default HomePageRedirect;
