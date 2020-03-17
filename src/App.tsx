import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "reactstrap";
import Menu from "./screens/menu/Menu";
import Inicio from "./screens/inicio/Inicio";

import { initApp } from "./firebase";

export default function App() {
  useEffect(() => {
    initApp();
  }, []);

  const [filter, setFilter] = useState("Todos");

  return (
    <div>
      <Container style={{ marginTop: 24 }}>
        <Row style={{ padding: 10, alignItems: "center" }}>
          <Col>
            <h1>Ponto Eletrônico</h1>
          </Col>
          <Col className="d-flex justify-content-end">
            <img
              style={{ width: 80, height: 80 }}
              src={require("./img/logo_resolve_direito_2019.png")}
            />
          </Col>
        </Row>
      </Container>
      <Menu filter={filter} onChangeFilter={setFilter} />
      <Inicio filter={filter} />
    </div>
  );
}
