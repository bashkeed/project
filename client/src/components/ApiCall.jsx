import React, { useEffect, useState } from "react";
import axios from "axios";

const ApiCall = () => {
  const [coins, setCoins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coinlore.net/api/tickers/"
        );
        setCoins(response.data.data);
      } catch (error) {
        console.error("Error fetching the coins:", error);
      }
    };

    fetchCoins();
  }, []);

  // Get current coins for the current page
  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = coins.slice(indexOfFirstCoin, indexOfLastCoin);

  const totalPages = Math.ceil(coins.length / coinsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="App">
      <h1>Cryptocurrency Prices</h1>
      <table>
        <thead>
          <tr>
            <th>💰Coin</th>
            <th>📄Code</th>
            <th>🤑Price (USD)</th>
            <th>📈Total Supply</th>
          </tr>
        </thead>
        <tbody>
          {currentCoins.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
              <td>${parseFloat(coin.price_usd).toFixed(2)}</td>
              <td>${parseFloat(coin.tsupply).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApiCall;
