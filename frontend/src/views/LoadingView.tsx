import React from 'react';

import AppLayout from '../layouts/AppLayout';


interface LoadingViewProps {}

const LoadingView: React.FC<LoadingViewProps> = () => {
  return (
    <AppLayout selectedNavigation="">LoadingView</AppLayout>
  );
}

export default LoadingView;
