import { State } from "./state";
import { Patient, Diagnosis, PatientDetailed, Entry } from "../types";

export type Action =
  | {
    type: "ADD_ENTRY";
    payload: Entry,
		id: Patient['id'];
  }
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "UPDATE_PATIENT_INFO";
      payload: PatientDetailed;
    }
  | {
		type: "SET_DIAGNOSES";
		payload: Diagnosis[];
	};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient
  };
};

export const addEntry = (id: Patient['id'], entry: Entry): Action => {
	return {
		type: "ADD_ENTRY",
		id,
		payload: entry
	};
};

export const setPatientList = (list: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: list
  };
};

export const updatePatient = (patient: PatientDetailed): Action => {
	return {
		type: "UPDATE_PATIENT_INFO",
		payload: patient
	};
};

export const setDiagnoses = (diagnoses: Diagnosis[]): Action => {
	return {
		type: "SET_DIAGNOSES",
		payload: diagnoses
	};
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_ENTRY":
      const current = state.patients[action.id];
      const currentEntries = current.entries ? current.entries : [];
			return {
				...state,
				patients: {
					...state.patients,
					[action.id]: {
						...current,
						entries: [...currentEntries, action.payload]
					}
				}
			};
    case "SET_DIAGNOSES":
        return {
          ...state,
          diagnoses: {
            ...action.payload.reduce((acc, cur) => {
              acc[cur.code] = cur;
              return acc;
            }, ({} as { [id: string]: Diagnosis; })),
            ...state.diagnoses
          }
        };
    case "UPDATE_PATIENT_INFO":
          return {
            ...state,
            patients: {
              ...state.patients,
              [action.payload.id]: action.payload
            }
          };
    default:
      return state;
  }
};
