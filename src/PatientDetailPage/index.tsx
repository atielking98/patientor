import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";
import { PatientDetailed, Gender } from "../types";
import { Loader, Card, Icon } from "semantic-ui-react";

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
    console.log(patient);
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
    </div>;
};

export default PatientDetailPage;
