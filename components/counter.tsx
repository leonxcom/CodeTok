"use client";

import { useState, memo } from "react";
import { Button } from "@heroui/button";

const CounterComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <Button radius="full" onPress={() => setCount(count + 1)}>
      Count is {count}
    </Button>
  );
};

export const Counter = memo(CounterComponent);
