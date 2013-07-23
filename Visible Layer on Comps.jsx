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

	// Get selected Layers Indexes
	var layersIdxs = getSelectedLayersIdx();
	var visibility = [];

	for ( var i=0; i<layersIdxs.length; i++ ) {
		var idx = layersIdxs[i];
		visibility[i] = getVisibilityByIndex(docRef, idx);
	}

	var comps = docRef.layerComps;
	var cpmpsLength = comps.length;
	for ( var i=0; i<cpmpsLength; i++ ){

		var comp = comps[i];
		if (!comp.selected) continue;

		comp.apply();

		// Cycle through layers
		for ( var j=0; j<layersIdxs.length; j++ ) {
			var idx = layersIdxs[j];
			setVisibilityByIndex(docRef, idx, visibility[j]);
		}

		comp.recapture();

	}

}

function getVisibilityByIndex(doc, idx){
	var desc = Stdlib.getLayerDescriptorByIndex(doc, idx);
	return desc.getBoolean(cTID('Vsbl'));
}

function setVisibilityByIndex(doc, idx, visibility){
  function _ftn() {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIndex(cTID('Lyr '), idx);
    desc.putReference(cTID('null'), ref );
	var state = visibility ? 'Shw ' : 'Hd  ';
	executeAction(cTID(state), desc, DialogModes.NO);
  }

  Stdlib.wrapLC(doc, _ftn);
}

function getSelectedLayersIdx(){
	var selectedLayers = new Array;
	var ref = new ActionReference();
	ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
	var desc = executeActionGet(ref);
	if ( desc.hasKey( stringIDToTypeID( 'targetLayers' ) ) ){
		desc = desc.getList( stringIDToTypeID( 'targetLayers' ));
		var c = desc.count
		var selectedLayers = new Array();
		for( var i=0; i<c; i++ ){
			try{
				 activeDocument.backgroundLayer;
				 selectedLayers.push( desc.getReference(i).getIndex() );
			}catch(e){
				 selectedLayers.push( desc.getReference(i).getIndex() + 1 );
			}
		}
	}else{
		var ref = new ActionReference();
		ref.putProperty( charIDToTypeID("Prpr") , charIDToTypeID( "ItmI" ));
		ref.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );
		try {
			activeDocument.backgroundLayer;
			selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" ))-1);
		} catch(e) {
			selectedLayers.push( executeActionGet(ref).getInteger(charIDToTypeID( "ItmI" )));
		}
	}
	return selectedLayers;
}

