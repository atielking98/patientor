import { HealthCheckRating, EntryOptions } from "../types";
import { Form } from "semantic-ui-react";
import { Field } from "formik";


// structure of a single option
export type HealthCheckRatingOption = {
	value: HealthCheckRating;
	label: string;
};

// props for select field component
type SelectFieldProps = {
	name: string;
	label: string;
	options: HealthCheckRatingOption[];
};

export const SelectField: React.FC<SelectFieldProps> = ({
	name,
	label,
	options
}: SelectFieldProps) => (
		<Form.Field>
			<label>{label}</label>
			<Field as="select" name={name} className="ui dropdown">
				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label || option.value}
					</option>
				))}
			</Field>
		</Form.Field>
	);


export const SelectEntryType: React.FC<{name: string; label: string;}> = ({
	name,
	label,
}) => (
		<Form.Field>
			<label>{label}</label>
			<Field as="select" name={name} className="ui dropdown">
				{EntryOptions.map(option => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</Field>
		</Form.Field>
	);