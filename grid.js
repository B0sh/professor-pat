Grid = {};

Grid.SizeX = 0;
Grid.SizeY = 0;

Grid.Generate = function(sizeX, sizeY) {
  Grid.SizeX = sizeX;
  Grid.SizeY = sizeY;
  Table = "<table class='grid_table'>";
  total = 0;
  for (y = 0; y < sizeY; y++) {
    Table += "<tr>";
    for (x = 0; x < sizeX; x++) {
      total++;
      Table += "<td xy='" + x + "," + y + "' num='" + total + "' class='person'></td>";
    }
    Table += "</tr>";
  }
  Table += "</table>";

  $('#where_the_grid_goes').html(Table);
};

Grid.Populate = function () {
  num = 0;
  for (y = 0; y < Grid.SizeY; y++) {
    for (x = 0; x < Grid.SizeX; x++) {
      if (Game.Equation.is(num))
        $('[num='+num+']').addClass("active");
      else
        $('[num='+num+']').removeClass("active");
      num++;
    }
  }

};
