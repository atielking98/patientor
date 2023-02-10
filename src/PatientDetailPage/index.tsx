import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";
import { assertNever, PatientDetailed, Gender, Entry, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry } from "../types";
import { Loader, Card, Label, Rating, Icon, Header, Feed, Segment, List } from "semantic-ui-react";

const genderBadge = (gender: Gender) => {
	switch (gender) {
		case Gender.Female:
			return "venus";
		case Gender.Male:
			return "mars";
		case Gender.Other:
			return "genderless";
	}
};

const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry; }> = ({ entry }) => {
	return (
		<Segment raised>
			<Rating icon="heart" rating={4 - entry.healthCheckRating} maxRating={4} disabled />
			<Icon name="doctor" />{entry.specialist}
		</Segment>
	);
};

const HospitalEntryDetails: React.FC<{ entry: HospitalEntry; }> = ({ entry }) => {
	return (
		<Segment raised>
			<Label color="orange" ribbon>{entry.discharge.date}</Label>
			<p>{entry.discharge.criteria}</p>
			<Icon name="doctor" />{entry.specialist}
		</Segment>
	);
};

const OccupationalHealthcareDetails: React.FC<{ entry: OccupationalHealthcareEntry; }> = ({ entry }) => {
	return (
		<Segment raised>
			<Label>
				Employer
				<Label.Detail>{entry.employerName}</Label.Detail>
			</Label>
			{entry.sickLeave ?
				(<>
					<Header>Sick Leave</Header>
					<Label>
						Starting on:
						<Label.Detail>{entry.sickLeave.startDate}</Label.Detail>
					</Label>
					<Label>
						Ended on:
						<Label.Detail>{entry.sickLeave.endDate}</Label.Detail>
					</Label>
				</>)
				: null}
			<Icon name="doctor" />{entry.specialist}
		</Segment>
	);
};

const EntryDetails: React.FC<{ entry: Entry; }> = ({ entry }) => {
	switch (entry.type) {
		case "HealthCheck":
			return <HealthCheckEntryDetails entry={entry} />;
		case "Hospital":
			return <HospitalEntryDetails entry={entry} />;
		case "OccupationalHealthcare":
			return <OccupationalHealthcareDetails entry={entry} />;
		default:
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return assertNever(entry);
	}
};

const EntryItem: React.FC<{ entry: Entry; }> = ({ entry }) => {
	const [{ diagnoses }] = useStateValue();
	const diagnosisName = (c: string): string => {
		return diagnoses[c] ? diagnoses[c].name : c;
	};
	return (
		<Feed.Event>
			<Feed.Label icon="marker" />
			<Feed.Content>
				<Feed.Date>{entry.date}</Feed.Date>
				<Feed.Summary>{entry.description}</Feed.Summary>
				<Feed.Extra>
					<List celled>
						{entry.diagnosisCodes && entry.diagnosisCodes.map(
							c => (
								<List.Item key={c} as="a">
									<Icon name='triangle right' />
									<List.Content>
										<List.Header>{c}</List.Header>
										<List.Description>
											{diagnosisName(c)}
										</List.Description>
									</List.Content>
								</List.Item>
							)
						)}
					</List>
					<EntryDetails entry={entry} />
				</Feed.Extra>
			</Feed.Content>
		</Feed.Event>
	);
};

const PatientDetailPage = () => {
    const { id } = useParams<{ id: string; }>();
    if (!id) return <div></div>;
    const [{ patients: { [id]: patient } }, dispatch] = useStateValue();

	React.useEffect(() => {
		if (!patient || 'ssn' in patient) {
			return;
		}
		const getDetail = async () => {
			try {
				const { data: payload } = await axios.get<PatientDetailed>(
					`${apiBaseUrl}/patients/${id}`
				);
				dispatch(updatePatient(payload));
			} catch (e) {
				console.error(e);
			}
		};
		void getDetail();
	}, [id, patient, dispatch]);

	if (!(patient && 'ssn' in patient)) {
		return <Loader size="big" indeterminate active content="Loading" />;
	}
    return <div>
        <h1></h1>
		<Card>
			<Card.Content>
				<Card.Header>
					{patient.name} <Icon name={genderBadge(patient.gender)} />
				</Card.Header>
				<Card.Meta>
					<span className='date'>{patient.dateOfBirth}</span>
				</Card.Meta>
				<Card.Description>
					{patient.occupation}
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<span><Icon name="id badge" />{patient.ssn}</span>
			</Card.Content>
		</Card>
		<Header content="Entries" icon="clipboard" />
		<Feed size='large'>
			{patient.entries && patient.entries.length > 0 ?
				patient.entries.map(e => (
					<EntryItem key={e.id} entry={e} />
				)) :
				<Segment placeholder>
					<Header>No entries are listed for this patient</Header>
				</Segment>
			}
		</Feed>
    </div>;
};

export default PatientDetailPage;
