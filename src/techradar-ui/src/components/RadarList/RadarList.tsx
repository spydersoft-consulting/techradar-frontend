import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../../api/Data";
//import ReactTooltip from 'react-tooltip'
import { fetchRadarList } from "../../store/slices/RadarListSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/store";
import { Container, Table } from "react-bootstrap";
import { useAuth } from "../../context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faWifi, faList, faEye, faChartPie } from "@fortawesome/free-solid-svg-icons";

export const RadarRow = (radar: api.Radar) => {
  const { isAuthenticated } = useAuth();
  return (
    <tr>
      <td>{radar.title}</td>
      <td>{radar.description}</td>
      <td>
        {/* <ReactTooltip id="toolTip" /> */}
        {isAuthenticated && (
          <>
            <Link to={`/radar/${radar.id}/`} data-tip="Edit Radar" data-for="toolTip">
              <FontAwesomeIcon icon={faEdit} className="m-1" />
            </Link>
            <Link to={`/radar/${radar.id}/arcs`} data-tip="Edit Radar Rings" data-for="toolTip">
              <FontAwesomeIcon icon={faWifi} className="m-1" />
            </Link>
            <Link to={`/radar/${radar.id}/quadrants`} data-tip="Edit Radar Quadrants" data-for="toolTip">
              <FontAwesomeIcon icon={faChartPie} className="m-1" />
            </Link>
            <Link to={`/radar/${radar.id}/items`} data-tip="Edit Radar Items" data-for="toolTip">
              <FontAwesomeIcon icon={faList} className="m-1" />
            </Link>
          </>
        )}
        <Link to={`/view/${radar.id}`} data-tip="View Radar" data-for="toolTip">
          <FontAwesomeIcon icon={faEye} className="m-1" />
        </Link>
      </td>
    </tr>
  );
};

export const RadarList: React.FunctionComponent = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchRadarList());
  }, [dispatch]);

  const { radars } = useSelector((state: RootState) => state.radarlist);

  return (
    <Container>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {radars.map((x) => (
            <RadarRow key={x.id} {...x} />
          ))}
          {isAuthenticated && (
            <tr>
              <td colSpan={3} className="text-right">
                <Link to={`/radar/`}>
                  <FontAwesomeIcon icon={faPlus} className="m-1" />
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};
