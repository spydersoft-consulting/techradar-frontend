import React, { ChangeEvent, useEffect } from "react";
import * as api from "../../api/Data";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IValidationErrorResult, callDataApi, getErrorMessages } from "../../utils/ApiFunctions";
import { RootState } from "../../store/store";
import { useAppDispatch } from "../../store/hooks";
import { fetchRadarList } from "../../store/slices/RadarListSlice";
import { Container, Form, Table, Col, Row } from "react-bootstrap";
import { fetchRadarArcList } from "../../store/slices/RadarArcListSlice";
import { updateFilter, fetchItemList } from "../../store/slices/ItemListSlice";
import { confirmAlert } from "react-confirm-alert";
import { fetchRadarQuadrantList } from "../../store/slices/RadarQuadrantListSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from "axios";

export const ItemList: React.FunctionComponent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const radarId = parseInt(id ?? "0");

  const { radars } = useSelector((state: RootState) => state.radarlist);

  const { arclist, quadlist } = useSelector((state: RootState) => state);

  const { selectedArcId, selectedQuadrantId, items } = useSelector((state: RootState) => state.itemlist);

  const radar = radars.find((r: api.Radar) => r.id === radarId);

  useEffect(() => {
    if (!radar) {
      dispatch(fetchRadarList());
    }
  }, [dispatch, radar]);

  useEffect(() => {
    if (arclist.radarId !== radarId || quadlist.radarId !== radarId) {
      dispatch(updateFilter({ arc: 0, quadrant: 0 }));
    }
  }, [dispatch, arclist.radarId, quadlist.radarId, radarId]);

  useEffect(() => {
    if (!arclist.arcs || arclist.arcs.length === 0 || arclist.radarId !== radarId) {
      dispatch(fetchRadarArcList(radarId));
    }

    if (!quadlist.quadrants || quadlist.quadrants.length === 0 || quadlist.quadrants[0].radarId !== radarId) {
      dispatch(fetchRadarQuadrantList(radarId));
    }
  }, [dispatch, arclist.arcs, arclist.radarId, quadlist.quadrants, quadlist.radarId, radarId]);

  useEffect(() => {
    dispatch(fetchItemList(radarId, selectedArcId, selectedQuadrantId));
  }, [dispatch, radarId, selectedArcId, selectedQuadrantId]);

  const performDelete = (id: number): void => {
    callDataApi((baseUrl) => api.ItemApiFactory(undefined, baseUrl).itemIdDelete(id))
      .then(() => dispatch(fetchItemList(radarId, selectedArcId, selectedQuadrantId)))
      .catch((e) => handleError("Error deleting item", e));
  };

  const handleDeleteItem = (id: number): void => {
    if (id <= 0) {
      return;
    }

    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            performDelete(id);
          },
        },
        {
          label: "No",
          onClick: () => {
            console.log("No action");
          },
        },
      ],
    });
  };

  const handleError = (titleMessage: string, e: Error | AxiosError<IValidationErrorResult>): void => {
    const errors = getErrorMessages(e);
    confirmAlert({
      title: titleMessage,
      message: errors["message"].join(":") ?? "Unknown Error",
      buttons: [
        {
          label: "Ok",
        },
      ],
    });
  };

  const handleQuadrantChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const newQuadrant = parseInt(event.target.value);
    dispatch(updateFilter({ arc: selectedArcId, quadrant: newQuadrant }));
  };

  const handleArcChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const newArc = parseInt(event.target.value);
    dispatch(updateFilter({ arc: newArc, quadrant: selectedQuadrantId }));
  };

  return (
    <Container>
      <h4>
        Radar Items - <small className="text-muted">{radar?.title ?? "unknown"}</small>
      </h4>
      <div>
        <Form>
          <Row>
            <Form.Group as={Col} controlId="filter_quadrant">
              <Form.Label>Quadrant</Form.Label>
              <select
                className="form-control"
                id="cmbQuadrant"
                value={selectedQuadrantId}
                onChange={handleQuadrantChange}
              >
                <option key="quad_0" defaultValue="" value="0"></option>
                {quadlist.quadrants.map((x) => (
                  <option key={`quad_${x.id}`} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </Form.Group>
            <Form.Group as={Col} controlId="filter_arc">
              <Form.Label>Arc</Form.Label>
              <Form.Control as="select" value={selectedArcId} onChange={handleArcChange}>
                <option key="arc_0" defaultValue="" value="0"></option>
                {arclist.arcs.map((x) => (
                  <option key={`arc_${x.id}`} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Row>
        </Form>
      </div>
      <Table striped responsive hover>
        <thead>
          <tr>
            <th>Key</th>
            <th>Name</th>
            <th>
              <Link to={`/radar/${radarId}/newitem`}>
                <FontAwesomeIcon icon={faPlus} className="m-1" />
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((radaritem: api.RadarItem): JSX.Element => {
            let key: JSX.Element = <i>No Key Defined</i>;
            if (radaritem.legendKey) {
              key = <span>{radaritem.legendKey}</span>;
            }

            return (
              <tr key={`radaritem_${radaritem.id}`}>
                <td>{key}</td>
                <td>{radaritem.name}</td>
                <td>
                  <Link to={`/item/${radaritem.id}/`}>
                    <FontAwesomeIcon icon={faEdit} className="m-1" />
                  </Link>
                  <button className="btn btn-link" onClick={() => handleDeleteItem(radaritem.id ?? 0)}>
                    <FontAwesomeIcon icon={faTrashAlt} className="m-1" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};
