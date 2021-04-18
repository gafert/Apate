# Plugin to edit Adobe XD element names

Element names which start with **m_, s_, w_, p_** can have unique ids which can be used in the simulation. To allow unique elements and not manually set them this plugin allows you to automatically add a unique ID to selected elements.

## Usage

Used IDs are stored in the document and cannot be used again. If the element ID is manually changed (0023 is removed or changed) it will be reset to the original ID.

1. Generate a .zip file of this folder
2. Rename the folder to .xdx
3. Add this Plugin to Adobe XD by double clicking the .xdx file (or go the UXP route for development of the plugin)
4. Select an element or a group starting with **m_, s_, w_, p_** (the plugin can only change direct children of the group and not elements in subgroups)
5. Go to the "Plug-ins" menu of Adobe XD to "Element IDs" -> "Rename elements with ID" or use CTRL+SHIFT+A

The element name should now be renamed:

**m_element** --> renamed to ---> **m_element_0023**

To delete the IDs use "Clear IDs". DELETES ALL IDs AND STARTS WITH 0.
