import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";
import { PatientDetailed, Gender, Entry } from "../types";
import { Loader, Card, Icon, Header, Feed, Segment, List } from "semantic-ui-react";

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

const EntryItem: React.FC<{ entry: Entry; }> = ({ entry }) => {
	const [{ diagnoses }] = useStateValue();
	console.log(diagnoses);
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
					{/* <EntryDetails entry={entry} /> */}
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
