/**
* ------------------------------------------------------------
* Copyright (c) 2012 Artem Matevosyan
* ------------------------------------------------------------
*
* @version $Revision: $:
* @author  $Author: $:
* @date    $Date: $:
*/

#target photoshop

//=============================================================================
// Position Layers on COmps
//=============================================================================

//@include 'include/stdlib.js'
//@include 'include/getSelectedLayers.js'

// Dispatch
main();


///////////////////////////////////////////////////////////////////////////////
// Function:	main
// Usage:		starting script rotine
// Input:		none
// Return:		none
///////////////////////////////////////////////////////////////////////////////
function main(){

	if ( app.documents.length <= 0 ) {
		if ( app.playbackDisplayDialogs != DialogModes.NO ) {
			alert("Document must be opened");
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}

	docRef = app.activeDocument;
	docName = docRef.name;

	Stdlib._restoreDoc = false;
	Stdlib._restoreLayer = false;

	var layers = getSelectedLayers();
	var layerBounds = [];
	var visibility = []

	for ( var i=0; i<layers.length; i++ ) {
		var layer = layers[i];
		visibility[i] = layer.visible;
		layerBounds[i] = Stdlib.getLayerBounds(docRef, layer);
	}

	var comps = docRef.layerComps;
	var cpmpsLength = comps.length;

	for ( var i=0; i<cpmpsLength; i++ ){
		var comp = comps[i];
		if (!comp.selected) continue;

		comp.apply();

		// Cycle through layers
		for ( var j=0; j<layers.length; j++ ) {
			var layer = layers[j];
			var currentBounds = Stdlib.getLayerBounds(docRef, layer);
			var newLayerBounds = layerBounds[j];
			var dx = newLayerBounds[0] - currentBounds[0];
			var dy = newLayerBounds[1] - currentBounds[1];
			Stdlib.moveLayerContent(docRef, layer, dx, dy)
			layer.visible = visibility[j];
		}

		comp.recapture();
	}

}
