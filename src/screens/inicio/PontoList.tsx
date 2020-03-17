import React, { useState, useEffect } from "react";
import { firestore } from "firebase/app";
import moment from "moment";

import { Row, Col, Container, Spinner, Alert } from "reactstrap";

import { Lista, Info } from "./style";

type Props = {
  filter: string;
};

export default function Inicio({ filter }: Props) {
  const [pontos, setPonto] = useState<PontoItem[]>([]);
  const [error, setError] = useState<Error>();

  function onSnapshot(snap: QuerySnapshot) {
    const items = snap.docs.map(doc => {
      const data = doc.data();
      return {
        ...(data as Ponto),
        time: moment(data.time.toDate()).format("DD/MM/YYYY [às] HH:mm"),
        key: doc.id
      };
    });
    setPonto(items);
  }

  function strNormalize(str: string) {
    return str
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  useEffect(() => {
    return firestore()
      .collection("pontos")
      .orderBy("time", "desc")
      .onSnapshot(onSnapshot, setError);
  }, []);

  function getStatus(status: number) {
    switch (status) {
      case 1:
        return "ENTRADA";

      case 2:
        return "SAÍDA";

      default:
        return [];
    }
  }

  function filtro(ponto: PontoItem) {
    const nome = ponto.person;

    console.log(strNormalize(filter), strNormalize(nome));

    if (filter === "Todos" || strNormalize(filter) === strNormalize(nome)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <Container style={{ marginTop: 20 }}>
      <Info>
        <Row>
          <Col sm="4">Nome</Col>
          <Col sm="2">QG</Col>
          <Col sm="4">Dia/Hora</Col>
          <Col sm="2">Tipo</Col>
        </Row>
      </Info>
      {pontos.length ? (
        pontos.filter(filtro).map(ponto => (
          <Lista key={ponto.key}>
            <Row>
              <Col sm="4">{ponto.person}</Col>
              <Col sm="2">{ponto.office}</Col>
              <Col sm="4">{ponto.time}</Col>
              <Col sm="2">{getStatus(ponto.type)}</Col>
            </Row>
          </Lista>
        ))
      ) : (
        <Row>
          <Col className="d-flex justify-content-center p-5">
            {error ? (
              <Alert color="danger">
                <h4 className="alert-heading">{error.name}</h4>
                <p className="mb-0">{error.message}</p>
              </Alert>
            ) : (
              <Spinner color="primary" />
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
}

//   const pontos = [
//     {
//       nome: "Hugo Lima Moura",
//       qg: "Ipatinga",
//       data: "23/5/1994",
//       tipo: "Saida"
//     },
//     {
//       nome: "Carlos Roberto",
//       qg: "Ipatinga",
//       data: "23/5/1993",
//       tipo: "Entrada"
//     }
//   ];
