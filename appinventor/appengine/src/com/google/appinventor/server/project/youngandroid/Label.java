package com.google.appinventor.server.project.youngandroid;

import java.util.Iterator;

import org.json.JSONObject;

public class Label {

	String backgroundColor="#FFFFFF";
	String fontSize="14";
	String fontBold="none";
	String fontItalic="none";
	String fontTypeface="sans-serif";
	String text="";
	String textAlign="left";
	String textColor="#000000";
	String visible="true";
	String width="auto";
	String height="auto";	
	String hasMargins="none";

	String name="";
	String type="Label";
	
	public String getBackgroundColor() {
		return backgroundColor;
	}
	public void setBackgroundColor(String backgroundColor) {
		this.backgroundColor = backgroundColor;
	}
	public String getFontSize() {
		return fontSize;
	}
	public void setFontSize(String fontSize) {
		this.fontSize = fontSize;
	}
	public String getFontBold() {
		return fontBold;
	}
	public void setFontBold(String fontBold) {
		this.fontBold = fontBold;
	}
	public String getFontItalic() {
		return fontItalic;
	}
	public void setFontItalic(String fontItalic) {
		this.fontItalic = fontItalic;
	}
	public String getFontTypeface() {
		return fontTypeface;
	}
	public void setFontTypeface(String fontTypeface) {
		this.fontTypeface = fontTypeface;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getTextAlign() {
		return textAlign;
	}
	public void setTextAlign(String textAlign) {
		this.textAlign = textAlign;
	}
	public String getTextColor() {
		return textColor;
	}
	public void setTextColor(String textColor) {
		this.textColor = textColor;
	}
	public String getVisible() {
		return visible;
	}
	public void setVisible(String visible) {
		this.visible = visible;
	}
	public String getWidth() {
		return width;
	}
	public void setWidth(String width) {
		this.width = width;
	}
	public String getHeight() {
		return height;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public String getHasMargins() {
		return hasMargins;
	}
	public void setHasMargins(String hasMargins) {
		this.hasMargins = hasMargins;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	
	 private String generateCSSforComponent()
	  {
		 StringBuilder sb=new StringBuilder();
		 sb.append("#"+this.getName()+"\n");
		 sb.append("{\n");
				
		sb.append(" background : "+this.getBackgroundColor()+";\n");
		sb.append(" font-size : "+this.getFontSize()+"px;\n");
	    sb.append(" font-weight : "+this.getFontBold()+";\n");
		sb.append(" font-style : "+this.getFontItalic()+";\n");
		sb.append(" font-family : "+this.getFontTypeface()+";\n");
		sb.append(" text-align : "+this.getTextAlign()+";\n");
		sb.append(" color : "+this.getTextColor()+";\n");
		sb.append(" width : "+this.getWidth()+";\n");
		sb.append(" height : "+this.getHeight()+";\n");
		sb.append(" border :"+this.getHasMargins()+";\n");
		 sb.append("}\n");
		 
		// System.out.println(sthis.toString().valueOf(sb));
		 
		 return sb.toString().valueOf(sb);
	  }
	  
	  private String generateHTMLforComponent()
	  {
		 StringBuilder sb=new StringBuilder();
		 sb.append("<label");
		 sb.append(" id="+"\""+this.getName()+"\"");
		 sb.append(" type="+"\""+this.getType()+"\"");
		 
		
		 if(this.getVisible().equals("False"))
			 sb.append(" hidden");
		 
		 sb.append(">");
		 sb.append(this.getText());
		 sb.append("</label>");
		  
		 //System.out.println("HTML equivalent for button: "+sthis.toString().valueOf(sb));
		return sb.toString().valueOf(sb);
	  }

	public String[] getConvertedLabelString(JSONObject component)
	{
		String htmlCssString[]=new String[2];
		
		 Iterator<String> itr=component.keys();
		 
		 try
		 {
		      while(itr.hasNext())
		      {
		    	  String str=itr.next();
		    	  
		    	  
		    	  if(str.equals("BackgroundColor"))
		    	  {
			    	 	StringBuilder color=new StringBuilder(component.getString(str));
			    	 	color.replace(0, 4, "#");			    	 		
			    	 	this.setBackgroundColor(color.toString().valueOf(color));
		    	  }
		    	  else if(str.equals("FontSize"))
		    		  this.setFontSize(component.getString(str));
		    	  else if(str.equals("FontBold"))
		    	  {
		    		  if(component.getString("FontBold").equalsIgnoreCase("True"))
		    			  this.setFontBold("bold");
		    	  }
		    		  
		    	  else if(str.equals("FontItalic"))
		    	  {
			    		  if(component.getString("FontItalic").equalsIgnoreCase("True"))
			    			  this.setFontItalic("italic");
		    	  }
		    	  else if(str.equals("FontTypeface"))
		    	  {
		    		  if(component.getString("FontTypeface").equals("1")||component.getString("FontTypeface").equals("2"))
		    			  this.setFontTypeface("sans-serif");
		    		  else if(component.getString("FontTypeface").equals("3"))
		    			  this.setFontTypeface("serif");
		    		  else 
		    			  this.setFontTypeface("monospace");
		    	  }
		    	  else if(str.equals("$Name"))
			    	  this.setName(component.getString(str));		 
		    	  else if(str.equals("Text"))
			    	  this.setText(component.getString(str));
		    	  else if(str.equals("TextAlignment"))
		    	  {
		    		  if(component.getString("TextAlignment").equals("1"))
		    			  this.setTextAlign("left");  
		    		  if(component.getString("TextAlignment").equals("2"))
		    			  this.setTextAlign("center");
		    		  if(component.getString("TextAlignment").equals("3"))
		    			  this.setTextAlign("right");  
		    	  }
		    	  else if(str.equals("$Type"))
			    	  this.setType(component.getString(str));		 
		    	  else if(str.equals("TextColor"))
		    	  {
			    	 	StringBuilder color=new StringBuilder(component.getString(str));
			    	 	color.replace(0, 4, "#");			    	 		
			    	 	this.setTextColor(color.toString().valueOf(color));
		    	  }	 
		    	  else if(str.equals("Width"))
		    	  {
		    		  if(component.getString("Width").equalsIgnoreCase("Automatic"))
		    			  this.setWidth("auto");
		    		  else if(component.getString("Width").equalsIgnoreCase("Fill Parent"))
		    			  this.setWidth("100%");
		    		  else
		    			  this.setWidth(component.getString(str)+"px");
		    	  }
		    	  else if(str.equals("Height"))
		    	  {
		    		  if(component.getString("Height").equalsIgnoreCase("Automatic"))
		    			  this.setHeight("auto");
		    		  else if(component.getString("Height").equalsIgnoreCase("Fill Parent"))
		    			  this.setHeight("100%");
		    		  else
		    		  {
		    			  this.setHeight(component.getString(str)+"px");
		    			  
		    		  }
		    			  
		    	  }
		    	  else
		    	  {
		    		  if(str.equals("HasMargins"))
		    		  {
		    			  if(component.getString("HasMargins").equalsIgnoreCase("True"))
		    			  {
		    				  this.setHasMargins("solid 1px");
		    			  }
		    		  }
		    	  }
		      }

		 }
		 catch(Exception e)
		 {
			 e.printStackTrace();
		 }

	    	  htmlCssString[0]=generateHTMLforComponent();
	    	  htmlCssString[1]=generateCSSforComponent();
	    	  return htmlCssString;
	
	    }
	
	
	
}
