import { ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from '../store/context/authContext';

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5
          }
        }
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Providers;
