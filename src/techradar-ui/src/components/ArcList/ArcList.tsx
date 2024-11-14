import React, { useEffect } from "react";
import * as api from "../../api/Data";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/store";
import { fetchRadarList } from "../../store/slices/RadarListSlice";
import { Container, Table } from "react-bootstrap";
import { fetchRadarArcList } from "../../store/slices/RadarArcListSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

export const ArcList: React.FunctionComponent = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const routeParams = useParams();
  const radarId = parseInt(routeParams.id ?? "0");

  useEffect(() => {
    dispatch(fetchRadarArcList(radarId));
  }, [dispatch, radarId]);

  const { radars } = useSelector((state: RootState) => state.radarlist);

  const { arcs } = useSelector((state: RootState) => state.arclist);

  const radar = radars.find((r: api.Radar) => r.id === radarId);

  useEffect(() => {
    if (!radar) {
      dispatch(fetchRadarList());
    }
  }, [dispatch, radar]);

  // const deleteArc = (id: number): void => {
  //     apiWrapper.callDataApi((baseUrl) => api.ArcApiFactory(undefined, baseUrl).apiArcIdDelete(id))
  //         .then(() => dispatch(fetchRadarArcList(radarId)));
  // }

  // const handleDeleteArc = (id: number): void => {
  //     confirmAlert({
  //         title: 'Confirm to delete',
  //         message: 'Are you sure you want to delete this item?',
  //         buttons: [
  //             {
  //                 label: 'Yes',
  //                 onClick: () => deleteArc(id)
  //             },
  //             {
  //                 label: 'No',
  //                 onClick: () => {}
  //             }
  //         ]
  //     });
  // }

  return (
    <Container>
      <h4>
        <small className="text-muted">{radar?.title ?? "unknown"}</small> - Radar Rings
      </h4>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>
              <Link to={`/radar/${radarId}/newarc`}>
                <FontAwesomeIcon icon={faPlus} className="m-1" />
              </Link>
            </th>
          </tr>
        </thead>
        <tbody>
          {arcs.map((radarArc: api.RadarArc) => (
            <tr key={`radaritem_${radarArc.id}`}>
              <td>{radarArc.name}</td>
              <td>{radarArc.position}</td>
              <td>
                <Link to={`/arc/${radarArc.id}/`}>
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

export default ArcList;
