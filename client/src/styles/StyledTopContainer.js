import styled from 'styled-components';

const StyledTopContainer = styled.div`
    background-color: white;
    display: flex;
    justify-content: space-evenly;
    height: 150px;
    .inputColumn{
        display: flex;
        flex-direction: column;
        border: 1px solid black;
        width: 33.3%;
        padding: 0 6px;
    }
    .inputColumn > select {
        align-self: flex-end;
    }
    .input{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
    }
    .input > input{
        width: 70%;
        height: 35px;
    }
`

export default StyledTopContainer;