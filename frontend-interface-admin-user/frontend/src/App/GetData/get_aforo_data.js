import {useEffect,useState} from "react";
import {db} from "../Conection/conection";

export const useDataAforo=()=>{
	const [error,setError]=useState(null);
	const [loading,setLoading]=useState(true);
	const [aforo,setAforo]=useState([]);

	useEffect(()=>{
		const unsubscribe=db.collection('csaforocontrol').onSnapshot(
				snapshot=>{
					setLoading(false)
					console.log("-----------------------------banana-------------");
					console.log(snapshot.doc);
					setAforo(snapshot.doc);
				},
				err=>{
					setError(err)
				}

			);
			return()=>unsubscribe()
		},
		[setAforo]
	)
	return {error,loading,aforo}
}
//https://www.faztweb.com/curso/reactjs-firebase-crud