import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { UpstreamDatabaseProperties } from "../../types/models";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { createDatabaseStart } from "../../redux/slices/data/databaseSlice";
import { DatabasesNavigation } from "../../constants/menu.";
import AppLayout from "../../layouts/AppLayout";
import CreateDatabaseForm from "../../components/CreateDatabaseForm";

interface CreateDatabaseViewProps {}

const CreateDatabaseView: React.FC<CreateDatabaseViewProps> = () => {
  const history = useHistory();
  const { loading, error } = useAppSelector((state) => state.data.database);
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = useState<boolean>(false);

  const onSubmit = (database: UpstreamDatabaseProperties) => {
    setProcessing(true);
    dispatch(createDatabaseStart(database));
  };

  useEffect(() => {
    if (!loading && processing) {
      setProcessing(false);
      if (error === undefined) {
        history.push(DatabasesNavigation.to);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <AppLayout selectedNavigation={DatabasesNavigation.name}>
      <CreateDatabaseForm
        processing={processing}
        errorMessage={error}
        onSubmit={onSubmit}
      />
    </AppLayout>
  );
};

export default CreateDatabaseView;
