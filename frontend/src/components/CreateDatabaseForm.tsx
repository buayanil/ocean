import React from 'react';
import * as yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { CheckCircleIcon } from '@heroicons/react/outline';

import { engineOptions } from '../constants/fixtures';
import EngineSelector from './EngineSelector/EngineSelector';
import { UpstreamDatabaseProperties } from '../types/models';

export interface CreateDatabaseFormProps { }


const CreateDatabaseForm: React.FC<CreateDatabaseFormProps> = () => {
    const createDatabaseSchema = yup.object().shape({
        name: yup.string()
            .required('Username is required')
            .min(4, 'Name should be of minimum 4 characters length'),
        engine: yup.string().required('Engine is required'),
    }).test('unique_name', 'Name is already registered', (value) => validateDatabaseValues(value));

    const validateDatabaseValues = (value: Partial<UpstreamDatabaseProperties>): boolean => {
        return false;
    }

    return (
        <>
            <div className="text-3xl text-gray-600 sm:text-4xl mb-5">Create a database</div>
            <div className="text-xl  text-gray-600 sm:text-2xl mb-3">Choose a database engine</div>
            <div className="text-sm font-light mb-3">A database runs a single database engine that powers one or more individual databases.</div>
            <Formik
                initialValues={{
                    name: '',
                    engine: '',
                }}
                validationSchema={createDatabaseSchema}
                onSubmit={(values: UpstreamDatabaseProperties, { setSubmitting }: FormikHelpers<UpstreamDatabaseProperties>) => {
                    setSubmitting(false);
                }}
            >
                {({ errors, touched, values, setFieldValue }) => (
                    <Form className="space-y-6">
                        <>
                            <EngineSelector
                                engineOptions={engineOptions}
                                error={errors.engine && touched.engine ? errors.engine : undefined}
                                selectedValue={values.engine}
                                onSelect={(value) => setFieldValue('engine', value)} />
                            <div className="text-xl text-gray-600 sm:text-2xl mt-6 mb-3">Choose a unique database name</div>
                            <div className="text-sm font-light">Names must be lowercase and start with a letter. They can be between 3 and 63 characters long and may contain dashes.</div>
                            <div className="mt-3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Database Name
                                </label>

                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="db-postgresql-htw1-70738"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                    </div>
                                    {errors.name && touched.name && (
                                        <span className="mt-2 text-sm text-red-600" id="nameHelp">{errors.name}</span>
                                    )}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-6 px-4 w-full py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create a database
                            </button>
                        </>
                    </Form>
                )}

            </Formik>
        </>
    );
}

export default CreateDatabaseForm;
