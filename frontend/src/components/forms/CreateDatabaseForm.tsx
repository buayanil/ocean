import React from "react";
import * as yup from "yup";
import { Field, Form, Formik, FormikHelpers } from "formik";
import {
  CheckCircleIcon,
  RefreshIcon,
  BanIcon,
} from "@heroicons/react/outline";

import { engineOptions } from "../../constants/engines";
import { EngineType, UpstreamDatabaseProperties } from "../../types/database";
import { DatabaseClient, DatabaseValidation } from "../../api/databaseClient";
import Alert from "../Alert";
import Headline from "../Headline";
import EngineSelector from "../EngineSelector/EngineSelector";

export interface CreateDatabaseFormProps {
  processing: boolean;
  errorMessage?: string;
  onSubmit: (database: UpstreamDatabaseProperties) => void;
}

const CreateDatabaseForm: React.FC<CreateDatabaseFormProps> = ({
  processing,
  errorMessage,
  onSubmit,
}) => {
  const createDatabaseSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .min(4, "Name should be of minimum 4 characters length")
      .matches(/^[a-z][a-z0-9_]*$/, "Name must begin with a letter (a-z). Subsequent characters in a name can be letters, digits (0-9), or underscores.")
      .test("unique_test", "Name is already registered", (value, ctx) =>
        validateDatabaseValues(value, ctx)
      ),
    engine: yup.string().required("Engine is required"),
  });

  const validateDatabaseValues = async (
    name: string | undefined,
    context: yup.TestContext<Record<string, any>>
  ): Promise<boolean> => {
    const engine = context.parent.engine as string | undefined;
    if (name !== undefined && engine !== undefined) {
      if (name.length < 4) {
        return false;
      }
      const payload: UpstreamDatabaseProperties = {
        name: name,
        engine: engine as EngineType,
      };
      const response = await DatabaseClient.existsDatabase(payload);
      try {
        const { exists } = DatabaseValidation.existsDatabaseSchema.validateSync(
          response.data
        );
        if (!exists) {
          return true;
        }
      } catch (parseError) {
        // TODO: user should know what happend
        return false;
      }
    }
    return false;
  };

  const renderNameInput = (
    touched: boolean,
    loading: boolean,
    valid: boolean
  ): JSX.Element => {
    if (loading) {
      <RefreshIcon
        className="animate-spin h-5 w-5 text-blue-400"
        aria-hidden="true"
      />;
    } else if (touched && valid) {
      return (
        <CheckCircleIcon
          className="h-5 w-5 text-green-400"
          aria-hidden="true"
        />
      );
    } else if (!valid && touched) {
      return <BanIcon className="h-5 w-5 text-red-400" aria-hidden="true" />;
    }
    return <BanIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />;
  };

  return (
    <>
      <div className="mb-5">
        <Headline title="Create a database" size="large" />
      </div>
      <div className="mb-3">
        <Headline title="Choose a database enginee" size="medium" />
      </div>
      <div className="text-sm font-light mb-3">
        A database runs a single database engine that powers one or more
        individual databases.
      </div>
      <Formik
        initialValues={{
          name: "",
          engine: EngineType.PostgreSQL,
        }}
        validationSchema={createDatabaseSchema}
        onSubmit={(
          values: UpstreamDatabaseProperties,
          { setSubmitting }: FormikHelpers<UpstreamDatabaseProperties>
        ) => {
          onSubmit(values);
          setSubmitting(true);
        }}
      >
        {({
          errors,
          touched,
          values,
          setFieldValue,
          isValidating,
          isValid,
        }) => (
          <Form className="space-y-6">
            <>
              <EngineSelector
                engineOptions={engineOptions}
                error={
                  errors.engine && touched.engine ? errors.engine : undefined
                }
                selectedValue={values.engine}
                onSelect={(value) => setFieldValue("engine", value)}
              />
              <div className="text-xl text-gray-600 sm:text-2xl mt-6 mb-3">
                Choose a unique database name
              </div>
              <div className="text-sm font-light">
                Names must be lowercase and start with a letter. They can be
                between 4 and 32 characters long and may contain underscores.
              </div>
              <div className="mt-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Database Name
                </label>
                {errors.name && touched.name && (
                  <span className="mt-2 text-sm text-red-600" id="nameHelp">
                    {errors.name}
                  </span>
                )}
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="abcd_1234"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {renderNameInput(values.name !== "", isValidating, isValid)}
                  </div>
                </div>
              </div>
              <Alert errorMessage={errorMessage} />
              <button
                type="submit"
                disabled={values.name === "" || !isValid || processing || isValidating}
                className="mt-6 px-4 w-full py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Create a database
              </button>
            </>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateDatabaseForm;
