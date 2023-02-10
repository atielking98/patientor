import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { useStateValue } from "../state";
import { Formik, Form, Field } from "formik";
import { HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import { DiagnosisSelection, TextField } from "../AddPatientModal/FormField";
import { HealthCheckRatingOption, SelectField, SelectEntryType} from "./FormField";
import { HealthCheckRating } from "../types";

export type EntryFormValues = Omit<HealthCheckEntry, 'id'> | Omit<HospitalEntry, 'id'> | Omit<OccupationalHealthcareEntry, 'id'>;
interface Props {
	onSubmit: (values: EntryFormValues) => void;
	onCancel: () => void;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
	{ value: HealthCheckRating.CriticalRisk, label: "CriticalRisk" },
	{ value: HealthCheckRating.HighRisk, label: "HighRisk" },
	{ value: HealthCheckRating.LowRisk, label: "LowRisk" },
	{ value: HealthCheckRating.Healthy, label: "Healthy" },
];

const isDate = (date: string): boolean => {
	return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
	return Object.values(HealthCheckRating).includes(Number(param));
};

const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
    const [{ diagnoses }] = useStateValue();
  
    return (
      <Formik
        initialValues={{
            description: "",
            date: "",
            specialist: "",
            diagnosisCodes: undefined,
            type: 'HealthCheck',
            healthCheckRating: 0,
        }}
        onSubmit={onSubmit}
        validate={values => {
            const requiredError = "Field is required";
            const dateError = 'Date must be in format: YYYY-MM-DD';
            const errors: { [field: string]: string | Record<string,string>; } = {};
            if (!values.description) {
                errors.description = requiredError;
            }
            if (!values.date) {
                errors.date = requiredError;
            } else if (!isDate(values.date)) {
                errors.date = dateError;
            }
            if (!values.specialist) {
                errors.specialist = requiredError;
            }
            switch (values.type) {
                case 'HealthCheck':
                    if (!isHealthCheckRating(values.healthCheckRating)) {
                        errors.healthCheckRating = 'Malformed rating';
                    }
                    break;
                case 'Hospital':
                    const err: Record<string,string> = {};
                    if (!values.discharge) {
                        errors.discharge = {};
                        errors.discharge.date = requiredError;
                        errors.discharge.criteria = requiredError;
                        break;
                    }
                    console.log(values.discharge);
                    if (!isDate(values.discharge.date)) {
                        err.date = dateError;
                    }
                    if (!values.discharge.criteria) {
                        err.criteria = requiredError;
                    }
                    if (err.date || err.criteria) {
                        errors.discharge = {};
                        errors.discharge = err;
                    }
                    break;
                case 'OccupationalHealthcare':
                    if (!values.employerName) {
                        errors.employerName = requiredError;
                    }
                    if (values.sickLeave) {
                        if (!(values.sickLeave.startDate || values.sickLeave.endDate)) {
                            values.sickLeave = undefined;
                            break;
                        }
                        const err: Record<string,string> = {};
                        if (!isDate(values.sickLeave.startDate)) {
                            err.startDate = dateError;
                        }
                        if (!isDate(values.sickLeave.endDate)) {
                            err.endDate = dateError;
                        }
                        if (err.startDate || err.endDate) {
                            errors.sickLeave = {};
                            errors.sickLeave = err;
                        }
                    }
                    break;
            }
            return errors;
        }}
      >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
  
        return (
          <Form className="form ui">
            <Field
                label="Description"
                placeholder="Description"
                name="description"
                component={TextField}
            />
            <Field
                label="Specialist"
                placeholder="Specialist"
                name="specialist"
                component={TextField}
            />
            <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
            />
            <DiagnosisSelection
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                diagnoses={Object.values(diagnoses)}
            />
            <SelectEntryType
                label="Type"
                name="type"
            />
            {values.type === 'HealthCheck' && (<>
            <SelectField
                label="HealthCheckRating"
                name="healthCheckRating"
                options={healthCheckRatingOptions}
            />
            </>)}
            {values.type === 'Hospital' && (<>
            <Field
                label="Discharge Date"
                placeholder="YYYY-MM-DD"
                name="discharge.date"
                component={TextField}
            />
            <Field
                label="Discharge criteria"
                placeholder="Discharge criteria"
                name="discharge.criteria"
                component={TextField}
            />
            </>)}
            {values.type === 'OccupationalHealthcare' && (<>
            <Field
                label="Employer Name"
                placeholder="Employer Name"
                name="employerName"
                component={TextField}
            />
            <Field
                label="Sick Leave Start Date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.startDate"
                component={TextField}
            />
            <Field
                label="Sick Leave End Date"
                placeholder="YYYY-MM-DD"
                name="sickLeave.endDate"
                component={TextField}
            />
            </>)}
            <Grid>
				<Grid.Column floated="left" width={5}>
                    <Button type="button" onClick={onCancel} color="red">
                        Cancel
                    </Button>
				</Grid.Column>
				<Grid.Column floated="right" width={5}>
					<Button
                        type="submit"
                        floated="right"
                        color="green"
                        disabled={!dirty || !isValid}
                    >
                        Add
                    </Button>
                </Grid.Column>
			</Grid>
          </Form>
        );
      }}
    </Formik>
    );
  };

export default AddEntryForm;