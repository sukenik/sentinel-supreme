export enum eToastType {
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR'
}

export interface iToastMessage {
	message: string
	type: eToastType
}
