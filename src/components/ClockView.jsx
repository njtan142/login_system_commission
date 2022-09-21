import React, { useEffect, useState } from 'react';
import styled from 'styled-components';


export default function ClockView() {
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Container>
      {value && value.toDateString()}
      <Time>{value && value.getHours()} : {value && value.getMinutes()} : {value && value.getSeconds()}</Time>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  time{
    height: 150px;
  }
  font-size: 1.5em;
  font-weight: bold;
  font-family: 'Courier New', Courier, monospace;
`;

const Time = styled.div`
`;