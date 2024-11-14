import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import * as api from "../../api/Data";
import { Link, useParams } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { RootState } from "../../store/store";
import { fetchRadarList } from "../../store/slices/RadarListSlice";
import { Container, Table } from "react-bootstrap";
import { fetchRadarQuadrantList } from "../../store/slices/RadarQuadrantListSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export const QuadrantList: React.FunctionComponent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const routeParams = useParams();
  const radarId = parseInt(routeParams.id ?? "0");

  useEffect(() => {
    dispatch(fetchRadarQuadrantList(radarId));
  }, [dispatch, radarId]);

  const { radars } = useSelector((state: RootState) => state.radarlist);

  const { quadrants } = useSelector((state: RootState) => state.quadlist);

  const radar = radars.find((r: api.Radar) => r.id === radarId);

  useEffect(() => {
    if (!radar) {
      dispatch(fetchRadarList());
    }
  }, [dispatch, radar]);

  return (
    <Container>
      <h4>
        <small className="text-muted">{radar?.title ?? "unknown"}</small> - Radar Quadrants
      </h4>
      <Table className="table table-striped thead-dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {quadrants.map((radarQuadrant: api.Quadrant) => (
            <tr key={`radaritem_${radarQuadrant.id}`}>
              <td>{radarQuadrant.name}</td>
              <td>{radarQuadrant.position}</td>
              <td>
                <Link to={`/quadrant/${radarQuadrant.id}/`}>
                  <FontAwesomeIcon icon={faEdit} className="m-1" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
