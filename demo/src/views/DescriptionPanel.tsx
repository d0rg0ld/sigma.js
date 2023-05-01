import React, { FC } from "react";
import { BsInfoCircle } from "react-icons/bs";

import Panel from "./Panel";

const DescriptionPanel: FC = () => {
  return (
    <Panel
      initiallyDeployed
      title={
        <>
          <BsInfoCircle className="text-muted" /> Description
        </>
      }
    >
      <p>
        This map represents a <i>bipartite network</i> of TU Wien theses and their author provided topics. Each{" "} colored <i>node</i> represents a thesis, each black node a topic and each edge an assingment of a topic to a thesis.
      </p>
      <p>
        The theses were retrieved via the ALMA LIS instance of the TU Wien Bibliothek, limited to those with a published PDF link and at least two connected topics.
      </p>
      <p>
        This web application has been developed by{" "}
        <a target="_blank" rel="noreferrer" href="https://www.tuwien.at/bibliothek">TU Wien Bibliothek </a>
        based on the {" "} <a target="_blank" rel="noreferrer" href="sigma.js demo">sigma.js demo</a>, using{" "}
        <a target="_blank" rel="noreferrer" href="https://reactjs.org/">
          react
        </a>{" "}
        and{" "}
        <a target="_blank" rel="noreferrer" href="https://www.sigmajs.org">
          sigma.js
        </a>
        . You can read the source code{" "}
        <a target="_blank" rel="noreferrer" href="https://github.com/jacomyal/sigma.js/tree/main/demo">
          on GitHub
        </a>
        .
      </p>
      <p>
		Topic nodes sizes are related to their indegree, representing their popularity. You can click a thesis node to open the related PDF document.
      </p>
    </Panel>
  );
};

export default DescriptionPanel;
