import React from 'react';
import styled from 'styled-components';


const BackdropContainer = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,.5);
`;



type BackdropProps = {
    children: React.ReactNode
}


const Backdrop: React.FC<BackdropProps> = ({children}): React.ReactElement => (
    <BackdropContainer>
        {children}
    </BackdropContainer>
)



export default Backdrop;