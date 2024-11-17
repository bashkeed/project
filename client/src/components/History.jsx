import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Icon from "@mdi/react";
// import { mdiReload } from "@mdi/js";
 import Loader from "./Loader"; 

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const ItemCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease; // Smooth transition for zoom effect
   &:hover {
    transform: scale(1.05); // Zoom effect on hover
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); // Optional shadow effect
`;

const Title = styled.h2`
  font-size: 24px;
  color: #666;
`;

const Description = styled.p`
  font-size: 16px;
  color: #fff;
`;

const Source = styled.p`
  font-size: 16px;
  color: #666;
  text-align: right
`;

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/api/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []); // Only run once on mount

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column mt-5">
      <p>Loading</p>
        <Loader/>
      </div>
    ); // Loading state
  }

  return (
    <>
      {items.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center flex-column mt-4 fs-5">
          <h3>No records found.</h3>
          <p style={{ color: '#f8f8f8' }}>
            Check your network connection and refresh the page.
          </p>
          <span>🤖</span>
        </div>
      ) : (
        <Container>
          {items.map((item) => (
            <ItemCard key={item._id}>
              <Title>{item.title}</Title>
              <Description>{item.description}</Description>
              <Source>{item.source}</Source>
            </ItemCard>
          ))}
        </Container>
      )}
    </>
  );
};

export default History;
