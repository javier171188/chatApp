import Context from '../context/Context';


const AddingUsers = () => {

    function addUser(e, userState, socket){
        console.log('Add users');
    }
    <Context.Consumer>
        {
            ({userState, socket}) => {
                return (<div>
                    <h1>Add a user</h1>
                    <form onSubmit={(e)=>addUser(e, userState, socket)}>
                            <input type="text" placeholder='Room name' required/>
                            {userState.contacts.map(c =>{
                                return (<label htmlFor={c._id} key={c._id}>
                                        <input 
                                            id={c._id} 
                                            type="checkbox" 
                                            name="participants" 
                                            value={c.userName}/> {c.userName}
                                        </label>)
                            })}

                            <button >Create</button>
                    </form>
                    <button onClick={goBack}>Cancel</button>
                </div>)
            }
        }
    </Context.Consumer>

}

export default AddingUsers;