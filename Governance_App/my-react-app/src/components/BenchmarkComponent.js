import React, { useState } from 'react';
import { runBenchmark } from '../API/labelAPI';
import { Button } from '@mui/material'; // Import Button from MUI

const BenchmarkComponent = () => {
  const [benchmarkResult, setBenchmarkResult] = useState(null);

  const handleButtonClick = async () => {
    const benchmark = await runBenchmark();
    setBenchmarkResult(benchmark);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleButtonClick}>
      Run Benchmark
    </Button>
  );
};

export default BenchmarkComponent;

// Note: The `runBenchmark` function needs to be defined and should return a promise.
