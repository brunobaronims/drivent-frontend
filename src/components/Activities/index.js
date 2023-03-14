import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { ActivitiesNotAvailableMessage } from './ActivitiesStyles';
import useEvent from '../../hooks/api/useEvent';
import { useEffect, useState } from 'react';
import activitiesHelpers from './helpers';

export default function ActivitiesSelection({ ticket }) {
  const { event, eventLoading } = useEvent();
  const [eventDays, setEventDays] = useState([]);
  //ao ser clicado, o index do dia da semana é salvo aqui:
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (event) {
      const startsAt = new Date(event.startsAt);
      const endsAt = new Date(event.endsAt);

      const days = activitiesHelpers.getDays(startsAt, endsAt);
      setEventDays(days);
    }
  }, [eventLoading]);

  return (
    <>
      <StyledTypography variant="h4">Escolha de hotel e quarto</StyledTypography>

      {!ticket && (
        <ActivitiesNotAvailableMessage>
          <p>Você ainda não possui um ingresso.</p>
        </ActivitiesNotAvailableMessage>
      )}

      {ticket?.TicketType?.isRemote === true && (
        <ActivitiesNotAvailableMessage>
          <p>Sua modalidade de ingresso não necessita escolher atividade. Você terá acesso a todas as atividades.</p>
        </ActivitiesNotAvailableMessage>
      )}

      {ticket?.status === 'RESERVED' && (
        <ActivitiesNotAvailableMessage>
          <p>Você precisa ter confirmado pagamento antes de fazer a escolha de atividades</p>
        </ActivitiesNotAvailableMessage>
      )}
      {!ticket?.TicketType?.isRemote && ticket?.status === 'PAID' && (
        <>
          {eventLoading ? (
            <>Carregando...</>
          ) : (
            <>
              {!selectedDay && <PageTitle>Primeiro, filtre pelo dia do evento: </PageTitle>}
              {eventDays.map((e, i) => (
                <DayButton isSelected={selectedDay === i} key={i} onClick={() => setSelectedDay(i)}>
                  {e.weekDayName}, {e.date}
                </DayButton>
              ))}
            </>
          )}
        </>
      )}
    </>
  );
}

const StyledTypography = styled(Typography)`
  margin-bottom: 20px !important;
`;

const DayButton = styled.button`
  background-color: ${(props) => (props.isSelected ? '#FFD37D' : '#e0e0e0')};
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  width: 131px;
  height: 37px;
  border: none;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 14px;
  margin-right: 43px;
  margin-bottom: 35px;
  cursor: pointer;
`;

export const PageTitle = styled.h1`
  margin-top: 26px;
  margin-bottom: 28px;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  color: #8e8e8e;
`;
