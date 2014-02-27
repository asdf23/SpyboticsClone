import bpy
import bpy_extras
import os
import json

"""
filename = "/home/userf19/FirefoxOS/SpyboticsClone/SpyboticsClone/ArtWork/blender2svg.py"
exec(compile(open(filename).read(), filename, 'exec'))
"""

class Bunch(dict):
	def __init__(self,**kw):
		dict.__init__(self,kw)
		self.__dict__ = self

def verticesToPath(vertexList, frameIndex): #pointList, whichFrame
	path = ""
	for indexVertexList in vertexList:
		path = "{0} {1},{2}".format(path, indexVertexList[frameIndex]["x"], indexVertexList[frameIndex]["y"])
	return path

animationData = None
animationData = Bunch()
animationData.KeyFrames = []
animationData.Meshes = []

#print(animationData)

"""
svg {
	background-color: black;
}
.line {
	stroke-width: 0.01;
	stroke: #00FF00;
	opacity: 1;
	fill: none;
	stroke-opacity: 1;
}

var a = document.getElementsByTagName("path");
for(var i=0; i<a.length; i++) {
    a[i].children[0].beginElement();
}

var a = document.getElementsByTagName("path");
for(var i=0; i<a.length; i++) {
    a[i].setAttribute("d", a[i].children[0].getAttribute("from") )
}


function renderFrame(frame) {
    var a = document.getElementsByTagName("path");
    for(var i=0; i<a.length; i++) {
        a[i].setAttribute("d", a[i].children[frame].getAttribute("to"));
    }
    while(document.getElementsByTagName("animate").length > 0) {
        document.getElementsByTagName("animate")[0].parentNode.removeChild(document.getElementsByTagName("animate")[0]);
    }
    console.log(document.getElementsByTagName("svg")[0].outerHTML)
}
renderFrame(2);
"""

for obj in bpy.context.scene.objects:
	obj.select = False
bpy.context.scene.objects.active = None

for obj in bpy.context.scene.objects:
	obj.select = True
	bpy.context.scene.objects.active = obj
	if hasattr(bpy.context.object.animation_data, "action"):
		for aFCurve in bpy.context.object.animation_data.action.fcurves:
			for keyFramePoint in aFCurve.keyframe_points:
				bpy.context.object.select = True
				print("frame for {0}: {1} object is selected? {2}".format(obj.name, keyFramePoint.co[0], bpy.context.object.select))
				frame = int(keyFramePoint.co[0])
				if frame not in animationData.KeyFrames:
					animationData.KeyFrames.append( frame )
				bpy.context.object.select = False
	obj.select = False
	bpy.context.scene.objects.active = None
animationData.KeyFrames.sort()

print(animationData.KeyFrames)

indexMesh = 0
for obj in bpy.context.scene.objects:
	obj.select = False
	if obj.type == "MESH":
		obj.select = True
		bpy.context.scene.objects.active = obj
		meshPolygonCount = len(obj.data.polygons)
		animationData.Meshes.append({
			 "Index": indexMesh
			,"Name": obj.name
			,"Faces": list(range(0, meshPolygonCount))
		})
		for indexFace in range(0, meshPolygonCount):
			animationData.Meshes[-1]["Faces"][indexFace] = list(range(0, len(bpy.data.objects[obj.name].data.polygons[indexFace].vertices)))
			for indexVector in animationData.Meshes[-1]["Faces"][indexFace]:
				animationData.Meshes[-1]["Faces"][indexFace][indexVector] = list(range(0, len(animationData.KeyFrames)))
				zeroIndexFrame = 0
				for indexFrame in animationData.KeyFrames:
					bpy.context.scene.frame_set(indexFrame)
					blenderVertexIndex = bpy.data.objects[obj.name].data.polygons[indexFace].vertices[indexVector]
					coordinate3D = bpy.context.active_object.matrix_world * bpy.data.objects[obj.name].data.vertices[blenderVertexIndex].co
					if(blenderVertexIndex == 0):
						print(coordinate3D)
					coordinate2D = bpy_extras.object_utils.world_to_camera_view(bpy.context.scene, bpy.data.objects["Camera"], coordinate3D)
					animationData.Meshes[-1]["Faces"][indexFace][indexVector][zeroIndexFrame] = ({
						 "VectorIndex": blenderVertexIndex
						,"x": coordinate2D[0]
						,"y": coordinate2D[1]
						,"z": coordinate2D[2]
					})
					zeroIndexFrame = zeroIndexFrame + 1
		bpy.context.scene.objects.active = None
		obj.select = False
	indexMesh = indexMesh + 1

#print(animationData)
"""
http://fc09.deviantart.net/fs71/i/2010/205/3/f/Cyber_Seven_by_lieggio.jpg
svg {
	background-color: black;
}
.line {
	stroke-width: 0.01;
	stroke: #00FF00;
	opacity: 1;
	fill: none;
	stroke-opacity: 1;
}
"""

with open("animation2.svg", "w") as filePointer:
	svgHeader = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<?xml-stylesheet href=\"style.css\" type=\"text/css\"?>\n<svg\n\t xmlns:svg=\"http://www.w3.org/2000/svg\"\n\t xmlns=\"http://www.w3.org/2000/svg\"\n\t width=\"1920\"\n\t height=\"1080\"\n\t version=\"1.1\" >\n\t<defs>\n\t</defs>\n\t<g\n\t transform=\"translate(0, 500)\" >\n\t\t<g\n\t\t transform=\"scale(1000, -500)\" >\n"
	svgFooter = "\t\t</g>\n\t</g>\n</svg>"
	filePointer.write(svgHeader)
	for indexMesh in range(0, len(animationData.Meshes)):
		for indexFace in range(0, len(animationData.Meshes[indexMesh]["Faces"])):
			filePointer.write("\t\t<path\n")
			filePointer.write("\t\t\t id=\"pathMesh{0}Face{1}\"\n".format(animationData.Meshes[indexMesh]["Name"].replace(".","_dot_"), indexFace))
			#filePointer.write("\t\t\t style=\"fill:none;stroke:#000000;stroke-width:0.0001;\"\n")
			filePointer.write("\t\t\t class=\"line\"\n")
			pointStrings = []
			#print("Reset pointStrings")
			#print("indexFace: {0}".format(indexFace))
			for indexFrame in range(0, len(animationData.KeyFrames)):
				pointStrings.append( verticesToPath( animationData.Meshes[indexMesh]["Faces"][indexFace], indexFrame ) )
				print(" ps++")
				#pointString = ""
				#print(" indexPoint: {0}".format(indexPoint))
				#for indexFrame in range(0, len(animationData.Meshes[indexMesh]["Faces"][indexFace][indexPoint])):
				#   #animationData.Meshes[indexMesh]["Faces"][indexFace][indexPoint][indexFrame]["x"]
				#   pointString = "{0} {1},{2}".format(pointString, animationData.Meshes[indexMesh]["Faces"][indexFace][indexPoint][indexFrame]["x"], animationData.Meshes[indexMesh]["Faces"][indexFace][indexPoint][indexFrame]["y"])
				#   print("  indexFrame: {0}".format(indexFrame))
				#pointStrings.append(pointString)
			#print("pointStrings.length = {0}".format(len(pointStrings)) )
			#<animaiton
			filePointer.write("\t\t\t d=\"M{0} z\" >\n".format(pointStrings[0]))
			zeroIndexPointString = 0
			for zeroIndexPointString in range(1, len(pointStrings)):
				if(zeroIndexPointString == 1):
					beginString = "0s"
				else:
					beginString = "pathMesh{0}Face{1}Animation{2}.end".format(animationData.Meshes[indexMesh]["Name"].replace(".","_dot_"), indexFace, (zeroIndexPointString-1))
				#beginString = "indefinite"
				durationString = "{0}s".format( 0.25 * (animationData.KeyFrames[indexFrame] - animationData.KeyFrames[indexFrame - 1]) )
				filePointer.write("\t\t\t<animate\n")
				filePointer.write("\t\t\t\t id=\"pathMesh{0}Face{1}Animation{2}\"\n".format(animationData.Meshes[indexMesh]["Name"].replace(".","_dot_"), indexFace, zeroIndexPointString))
				filePointer.write("\t\t\t\t attributeName=\"d\"\n")
				filePointer.write("\t\t\t\t from=\"M{0} z\"\n".format(pointStrings[zeroIndexPointString - 1]))
				filePointer.write("\t\t\t\t to=\"M{0} z\"\n".format(pointStrings[zeroIndexPointString]))
				filePointer.write("\t\t\t\t begin=\"{0}\"\n".format(beginString))
				filePointer.write("\t\t\t\t dur=\"{0}\"\n".format(durationString))
				filePointer.write("\t\t\t\t fill=\"freeze\" />\n")
				zeroIndexPointString = zeroIndexPointString + 1
			filePointer.write("\t\t</path>\n")
	filePointer.write(svgFooter)
	filePointer.close()

print("--end--")