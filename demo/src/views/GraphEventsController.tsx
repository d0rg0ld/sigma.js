import { useRegisterEvents, useSigma } from "@react-sigma/core";
import { FC, useEffect } from "react";

function getMouseLayer() {
  return document.querySelector(".sigma-mouse");
}

const GraphEventsController: FC<{ setHoveredNode: (node: string | null) => void }> = ({ setHoveredNode, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  const registerEvents = useRegisterEvents();

  var actNode: string;
  actNode="";

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    registerEvents({
	  doubleClickNode({ node }) {
		console.log("doubleclickNode");
       
        if (!graph.getNodeAttribute(node, "hidden")) {
          window.open(graph.getNodeAttribute(node, "URL"), "_blank");
        }
      },
      clickNode({ node }) {
               if (actNode=="") {
                       actNode=node;
                       setHoveredNode(node);
                       graph.setNodeAttribute(node, "highlighted", true);
                       console.log("clickNode activate");
               } else {
                       graph.setNodeAttribute(actNode, "highlighted", false);
                       actNode="";
                       setHoveredNode(null);
                       console.log("clickNode deactivate");
               }
      },
      enterNode({ node }) {
        setHoveredNode(node);
        // TODO: Find a better way to get the DOM mouse layer:
        const mouseLayer = getMouseLayer();
        if (mouseLayer) mouseLayer.classList.add("mouse-pointer");
      },
      leaveNode() {
        setHoveredNode(null);
        // TODO: Find a better way to get the DOM mouse layer:
        const mouseLayer = getMouseLayer();
        if (mouseLayer) mouseLayer.classList.remove("mouse-pointer");
      },
    });
  }, []);

  return <>{children}</>;
};

export default GraphEventsController;
