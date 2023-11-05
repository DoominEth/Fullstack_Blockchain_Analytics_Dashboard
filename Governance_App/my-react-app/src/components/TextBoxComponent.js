import React, { useEffect } from 'react';
import useProcessedDatasets from './processNetworkData';
import curveNetworkData from '../data/Networks/CurveNetwork.json';
import convexNetworkData from '../data/Networks/ConvexNetwork.json';

const TestComponent = () => {
  const simplify = false;

  const processedData = useProcessedDatasets(convexNetworkData,curveNetworkData, "Curve");

  useEffect(() => {
    //console.log(curveNetworkData);
    //console.log(convexNetworkData)
    console.log(processedData);
  }, [processedData]);

  return (
    <div>
      data in console.
    </div>
  );
};

export default TestComponent;
