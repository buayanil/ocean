import React, {useEffect} from 'react';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { DatabasesNavigation } from '../../constants/menu.';
import AppLayout from '../../layouts/AppLayout';
import DatabaseList from '../../components/DatabaseList/DatabaseList';
import { getDatabasesStart } from '../../redux/slices/databaseSlice';
import { StoreStatus } from '../../types/models';

interface DatabasesViewProps {}


const DatabasesView: React.FC<DatabasesViewProps> = () => {
  const dispatch = useAppDispatch();
  const {databases, status} = useAppSelector((state) => state.database);

  useEffect(() => {
    if (status === StoreStatus.PARTIALLY_LOADED) {
      dispatch(getDatabasesStart());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <h2 className="max-w-6xl mx-auto mt-8 mb-4 px-4 text-2xl font-semibold text-gray-900 sm:px-6 lg:px-8">
        Databases
      </h2>
      <DatabaseList databases={databases} />
    </AppLayout>
  );
}

export default DatabasesView;
