import React, { useEffect } from "react";
import * as api from "../../api/Data";
import { Link, useParams } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/store";
import { fetchRadarList } from "../../store/slices/RadarListSlice";
import { fetchRadarArcList } from "../../store/slices/RadarArcListSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export const ArcList: React.FunctionComponent = (): React.JSX.Element => {
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

  const actionsTemplate = (arc: api.RadarArc) => {
    return (
      <Link to={`/arc/${arc.id}/`}>
        <Button
          icon={<FontAwesomeIcon icon={faEdit} />}
          className="p-button-text p-button-sm"
          tooltip="Edit Arc"
          tooltipOptions={{ position: "top" }}
        />
      </Link>
    );
  };

  const headerTemplate = () => {
    return (
      <div className="flex justify-between items-center">
        <span>Actions</span>
        <Link to={`/radar/${radarId}/newarc`}>
          <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            className="p-button-text p-button-sm"
            tooltip="Add New Arc"
            tooltipOptions={{ position: "top" }}
          />
        </Link>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <Card>
        <h4 className="text-2xl font-bold mb-6">
          <small className="text-gray-500">{radar?.title ?? "unknown"}</small> - Radar Rings
        </h4>
        <DataTable value={arcs} stripedRows showGridlines scrollable emptyMessage="No arcs found">
          <Column field="name" header="Name" sortable />
          <Column field="position" header="Position" sortable />
          <Column body={actionsTemplate} header={headerTemplate} style={{ width: "10rem" }} />
        </DataTable>
      </Card>
    </div>
  );
};

export default ArcList;
